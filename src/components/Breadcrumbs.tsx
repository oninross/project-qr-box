"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const [user] = useAuthState(auth);

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
      <ol className="flex space-x-2">
        <li>
          {user ? (
            <Link href="/storage-hub" className="hover:underline">
              Storage Hub
            </Link>
          ) : (
            <Link href="/" className="hover:underline">
              Login
            </Link>
          )}
        </li>

        {segments.map((seg, idx) => {
          const href = "/" + segments.slice(0, idx + 1).join("/");
          const label = seg.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
          return (
            <li key={href} className="flex items-center">
              <span className="mx-2">/</span>
              {idx === segments.length - 1 ? (
                <span className="font-semibold">{label}</span>
              ) : (
                <Link href={href} className="hover:underline">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
