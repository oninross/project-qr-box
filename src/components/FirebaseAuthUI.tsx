"use client";

import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import * as firebaseui from "firebaseui";

// Import CSS dynamically
import "firebaseui/dist/firebaseui.css";

let firebaseUiInstance: firebaseui.auth.AuthUI | undefined;

export default function FirebaseAuthUI() {
  useEffect(() => {
    // Only initialize if not already initialized
    if (!firebaseUiInstance) {
      firebaseUiInstance = new firebaseui.auth.AuthUI(auth);
    }
    firebaseUiInstance.start("#firebaseui-auth-container", {
      signInFlow: "popup",
      signInOptions: [
        { provider: "google.com" },
        { provider: "apple.com" },
        { provider: "password" },
      ],
      signInSuccessUrl: "/storage-hub",
      tosUrl: "/",
      privacyPolicyUrl: "/",
    });

    return () => {
      firebaseUiInstance?.reset();
    };
  }, []);

  return <div id="firebaseui-auth-container" />;
}
