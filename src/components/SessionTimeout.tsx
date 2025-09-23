"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const PUBLIC_PATHS = ["/", "/what-is-bodega", "/terms-of-service", "/privacy-policy"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.includes(pathname);
}

export default function SessionTimeout() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && !isPublicPath(pathname)) {
        // Always preserve full path and query
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
