"use client";

import { useEffect, useRef } from "react";
import { auth } from "@/lib/firebase";

// Import CSS dynamically
import "firebaseui/dist/firebaseui.css";

export default function FirebaseAuthUI() {
  const uiRef = useRef<firebaseui.auth.AuthUI | null>(null);

  useEffect(() => {
    // Dynamically import firebaseui only on the client
    import("firebaseui").then((firebaseui) => {
      if (!uiRef.current) {
        uiRef.current = new firebaseui.auth.AuthUI(auth);
      }
      uiRef.current.start("#firebaseui-auth-container", {
        signInFlow: "popup",
        signInOptions: [
          { provider: "google.com" },
          { provider: "apple.com" },
          { provider: "password" },
        ],
        signInSuccessUrl: "/locker-room",
        tosUrl: "/",
        privacyPolicyUrl: "/",
      });
    });

    return () => {
      uiRef.current?.reset();
    };
  }, []);

  return <div id="firebaseui-auth-container" />;
}
