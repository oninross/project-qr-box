"use client";
import { useEffect, useRef } from "react";
import { auth } from "@/lib/firebase";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default function FirebaseAuthUI() {
  const uiRef = useRef<firebaseui.auth.AuthUI | null>(null);

  useEffect(() => {
    if (!uiRef.current) {
      uiRef.current = new firebaseui.auth.AuthUI(auth);
    }
    uiRef.current.start("#firebaseui-auth-container", {
      signInOptions: [
        { provider: "google.com" },
        { provider: "apple.com" },
        { provider: "password" },
      ],
      popupMode: true,
      signInSuccessUrl: "/",
      tosUrl: "/", // Link to your Terms of Service page
      privacyPolicyUrl: "/", // Link to your Privacy Policy page
    });
    return () => {
      uiRef.current?.reset();
    };
  }, []);

  return <div id="firebaseui-auth-container" />;
}
