"use client";
import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UserAvatarMenu({ size = 48 }: { size?: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        router.replace("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

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

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        aria-label="Open user menu"
        onClick={() => setOpen((v) => !v)}
        className="focus:outline-none"
        style={{ width: size, height: size }}
      >
        {photoURL ? (
          <Image
            src={photoURL}
            alt={displayName}
            width={size}
            height={size}
            className="rounded-full object-cover"
            style={{ width: size, height: size }}
          />
        ) : (
          <div
            className="rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-600"
            style={{ width: size, height: size }}
          >
            {fallback}
          </div>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
          {/* <button
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => {
              setOpen(false);
              router.push("/profile");
            }}
          >
            Profile
          </button> */}
          <button
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={async () => {
              setOpen(false);
              await signOut(auth);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
