"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
      <ol className="flex space-x-2">
        <li>
          <Link href="/storage-hub" className="hover:underline">
            Storage Hub
          </Link>
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
