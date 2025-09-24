"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

interface BreadcrumbsProps {
  boxName?: string;
  itemName?: string;
  isLoading?: boolean;
}

export default function Breadcrumbs({ boxName, itemName, isLoading = false }: BreadcrumbsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const segments = pathname.split("/").filter(Boolean);
  const [user] = useAuthState(auth);

  // Get query params for building links
  const boxId = searchParams.get("boxId");
  const boxCode = searchParams.get("boxCode");

  // Check if we're on an item page
  const isItemPage = pathname === "/item";

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

        {/* If on item page, manually add box breadcrumb */}
        {isItemPage && (
          <li className="flex items-center">
            <span className="mx-2">/</span>
            {isLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <Link
                href={boxId && boxCode ? `/box?boxId=${boxId}&boxCode=${boxCode}` : "/storage-hub"}
                className="hover:underline"
              >
                {boxName || "Box"}
              </Link>
            )}
          </li>
        )}

        {segments.map((seg, idx) => {
          const href = "/" + segments.slice(0, idx + 1).join("/");
          let label = seg.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
          let linkHref = href;

          // Handle box segment (for /box pages)
          if (seg === "box") {
            if (isLoading) {
              return (
                <li key={href} className="flex items-center">
                  <span className="mx-2">/</span>
                  <Skeleton className="h-4 w-24" />
                </li>
              );
            } else if (boxName) {
              label = boxName;
              // Build proper box link with query params
              linkHref = boxId && boxCode ? `/box?boxId=${boxId}&boxCode=${boxCode}` : href;
            }
          }

          // Handle item segment
          if (seg === "item") {
            if (isLoading) {
              return (
                <li key={href} className="flex items-center">
                  <span className="mx-2">/</span>
                  <Skeleton className="h-4 w-32" />
                </li>
              );
            } else if (itemName) {
              label = itemName;
            }
          }

          return (
            <li key={href} className="flex items-center">
              <span className="mx-2">/</span>
              {idx === segments.length - 1 ? (
                <span className="font-semibold">{label}</span>
              ) : (
                <Link href={linkHref} className="hover:underline">
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
