"use client";

import UserAvatarMenu from "@/components/UserAvatarMenu";
import RequireAuth from "@/components/RequireAuth";
import { useRouter } from "next/navigation";
import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

type Box = {
  id: string;
  name?: string;
  boxCode?: string;
  userId?: string;
  // Add other fields as needed
};

export default function LockerRoom() {
  const router = useRouter();
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      setLoading(true);
      setError("");
      if (!user) {
        setBoxes([]);
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, "boxes"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        setBoxes(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch {
        setError("Failed to load your boxes.");
      } finally {
        setLoading(false);
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <RequireAuth>
      <main className="mt-8 w-full m-auto max-w-2xl px-6">
        <div className="flex space-between w-full">
          <h1 className="text-4xl mr-auto font-bold">Locker Room</h1>
          <UserAvatarMenu size={48} />
        </div>

        <div className="mt-8 space-y-4">
          {loading && <div className="text-gray-500">Loading your boxes...</div>}

          {error && <div className="text-red-600">{error}</div>}

          {!loading && !error && boxes.length === 0 && (
            <p className="flex gap-1 text-gray-400">
              No boxes found. Click <PackageOpen /> to add one!
            </p>
          )}

          {!loading &&
            !error &&
            boxes.map((box) => (
              <Card
                key={box.id}
                className="cursor-pointer rounded-sm hover:shadow-lg transition"
                onClick={() => router.push(`/box?boxId=${box.id}&boxCode=${box.boxCode}`)}
              >
                <CardHeader>
                  <CardTitle>{box.name}</CardTitle>
                </CardHeader>
              </Card>
            ))}
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
