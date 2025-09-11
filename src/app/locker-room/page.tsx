"use client";

import UserAvatarMenu from "@/components/UserAvatarMenu";
import RequireAuth from "@/components/RequireAuth";
import { useRouter } from "next/navigation";
import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LockerRoom() {
  const router = useRouter();
  return (
    <RequireAuth>
      <main className="mt-8 w-full m-auto max-w-2xl">
        <div className="flex space-between w-full">
          <h1 className="text-4xl mr-auto font-bold">Locker Room</h1>
          <UserAvatarMenu size={48} />
        </div>

        <Button
          size="icon"
          className="fixed bottom-22 right-6 w-12 h-12 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 focus:outline-none z-50 transition-all duration-200 ease-out hover:scale-110"
          style={{ fontSize: 28 }}
          aria-label="Add"
          onClick={() => router.push("/new-box")}
        >
          <PackageOpen />
        </Button>
      </main>
    </RequireAuth>
  );
}
