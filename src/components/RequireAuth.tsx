"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        if (typeof window !== "undefined") {
          const redirectTo = window.location.pathname + window.location.search;
          if (window.location.pathname !== "/") {
            window.location.replace(`/?redirect=${encodeURIComponent(redirectTo)}`);
          }
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (user === undefined) return null;
  if (!user) return null;
  return <>{children}</>;
}
