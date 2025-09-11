"use client";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SessionTimeout() {
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    const TIMEOUT = 5 * 60 * 1000; // 5 minutes

    function resetTimeout(broadcast = true) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        signOut(auth);
        if (broadcast) localStorage.setItem("qrbox-session-timeout", Date.now().toString());
      }, TIMEOUT);
    }

    function handleActivity() {
      resetTimeout();
    }

    function handleVisibility() {
      if (document.visibilityState === "visible") {
        resetTimeout();
      }
    }

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("focus", handleActivity);
    document.addEventListener("visibilitychange", handleVisibility);

    // Listen for logout from other tabs
    function handleStorage(e: StorageEvent) {
      if (e.key === "qrbox-session-timeout") {
        signOut(auth);
      }
    }
    window.addEventListener("storage", handleStorage);

    resetTimeout(false);
    return () => {
      if (timeout) clearTimeout(timeout);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("focus", handleActivity);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);
  return null;
}
