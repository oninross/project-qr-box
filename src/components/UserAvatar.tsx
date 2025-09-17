"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";

export default function UserAvatar({ size = 48 }: { size?: number }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (u) => {
        setUser(u);
      },
      (error) => {
        console.error("[UserAvatar] onAuthStateChanged error:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-600"
      >
        ?
      </div>
    );
  }

  const photoURL = user.photoURL;
  const displayName = user.displayName || user.email || "";
  const fallback = displayName.charAt(0).toUpperCase();

  if (photoURL) {
    return (
      <Image
        src={photoURL}
        alt={displayName}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-600"
    >
      {fallback}
    </div>
  );
}
