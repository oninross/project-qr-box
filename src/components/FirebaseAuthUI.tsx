"use client";

import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import * as firebaseui from "firebaseui";
import { useRouter, useSearchParams } from "next/navigation";
import "firebaseui/dist/firebaseui.css";

let firebaseUiInstance: firebaseui.auth.AuthUI | undefined;

export default function FirebaseAuthUI() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
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
      callbacks: {
        signInSuccessWithAuthResult: () => {
          // Use redirect param if present, else go to /storage-hub
          if (redirect) {
            router.replace(redirect);
          } else {
            router.replace("/storage-hub");
          }
          return false; // Prevent default redirect
        },
      },
      tosUrl: "/",
      privacyPolicyUrl: "/",
    });

    return () => {
      firebaseUiInstance?.reset();
    };
  }, [router, redirect]);

  return <div id="firebaseui-auth-container" />;
}
