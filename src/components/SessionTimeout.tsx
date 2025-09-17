"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

export default function SessionTimeout() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    let timeout: NodeJS.Timeout | null = null;
    const TIMEOUT = 5 * 60 * 1000; // 5 minutes

    async function handleSignOutAndRedirect() {
      try {
        await signOut(auth);
      } catch (e) {
        // Optionally log error
      } finally {
        if (isMounted.current) {
          router.replace("/");
        }
      }
    }

    function resetTimeout(broadcast = true) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        handleSignOutAndRedirect();
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
        handleSignOutAndRedirect();
      }
    }
    window.addEventListener("storage", handleStorage);

    resetTimeout(false);
    return () => {
      isMounted.current = false;
      if (timeout) clearTimeout(timeout);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("focus", handleActivity);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("storage", handleStorage);
    };
  }, [router]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) return null; // or a loading spinner

  return null;
}
