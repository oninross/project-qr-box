"use client";
import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
    return null;
  }

  const photoURL = user.photoURL;
  const displayName = user.displayName || user.email || "";
  const fallback = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative inline-block" ref={menuRef}>
      <Button
        variant="ghost"
        aria-label="Open user menu"
        onClick={() => setOpen((v) => !v)}
        className="p-0 focus:outline-none"
        style={{ width: size, height: size, borderRadius: "9999px" }}
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
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
          <Button
            variant="ghost"
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => {
              setOpen(false);
              router.push("/profile");
            }}
          >
            Profile
          </Button>
          <Button
            variant="ghost"
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={async () => {
              setOpen(false);
              await signOut(auth);
            }}
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}
