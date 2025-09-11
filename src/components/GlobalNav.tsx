"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { usePathname, useRouter } from "next/navigation";
import { Box, HelpCircle, PackageOpen, ScanQrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Locker Room", path: "/locker-room", icon: PackageOpen },
  { label: "Scan", path: "/scan", icon: ScanQrCode },
  { label: "Help", path: "/help", icon: HelpCircle },
];

export default function GlobalNav() {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  if (!user) return null;

  return (
    <nav className="fixed border-t-1 border-oklch(70.5% 0.015 286.067) bottom-0 left-0 w-full bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700 z-50">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.path}>
              <Button
                variant="ghost"
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  pathname === item.path
                    ? "text-primary dark:text-primary-400"
                    : "text-zinc-600 dark:text-zinc-300 hover:text-primary dark:hover:text-primary-400"
                }`}
                onClick={() => router.push(item.path)}
                aria-current={pathname === item.path ? "page" : undefined}
              >
                <Icon size={22} />
                <span className="text-xs">{item.label}</span>
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
