"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const PUBLIC_PATHS = ["/", "/what-is-bodega", "/terms-of-service", "/privacy-policy"];

function isPublicPath(pathname: string) {
  let pathOnly = pathname.split("?")[0].replace(/\/+$/, "").toLowerCase();
  if (pathOnly === "") pathOnly = "/";
  if (!pathOnly.startsWith("/")) pathOnly = "/" + pathOnly;
  return PUBLIC_PATHS.includes(pathOnly);
}

const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes

export default function SessionTimeout() {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if we're on localhost
  const isLocalhost = (process.env.NEXT_PUBLIC_BASE_URL === "localhost" ||
     process.env.NEXT_PUBLIC_BASE_URL === "127.0.0.1" ||
     process.env.NEXT_PUBLIC_BASE_URL?.startsWith("192.168."));

  useEffect(() => {
    // Skip inactivity timer on localhost
    if (isLocalhost) {
      console.log("SessionTimeout: Disabled on localhost");
      return;
    }

    const auth = getAuth();

    // Inactivity timer logic
    function resetTimer() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        // Only sign out if user is logged in and not on a public path
        if (auth.currentUser && !isPublicPath(pathname)) {
          window.localStorage.setItem("qrbox-logout-inactivity", "1");
          signOut(auth);
        }
      }, INACTIVITY_LIMIT);
    }

    // Listen for user activity
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    // Clean up
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [pathname]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && !isPublicPath(pathname)) {
        const redirectTo =
          typeof window !== "undefined"
            ? window.location.pathname + window.location.search
            : pathname;
        window.location.replace(`/?redirect=${encodeURIComponent(redirectTo)}`);
      }
    });
    return () => unsubscribe();
  }, [pathname, router]);

  return null;
}
