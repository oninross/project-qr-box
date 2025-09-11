"use client";

import { useSearchParams } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import UserAvatar from "@/components/UserAvatar";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface Box {
  name?: string;
  description?: string;
  // Add other fields as needed
}

export default function BoxDetail() {
  const params = useSearchParams();
  const boxId = params.get("boxId");
  const boxCode = params.get("boxCode");
  const [box, setBox] = useState<Box | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBox() {
      setError("");
      try {
        const docRef = doc(db, "boxes", boxId as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBox(docSnap.data());
        } else {
          setError("Box not found.");
        }
      } catch {
        setError("Failed to load box details.");
      }
    }
    if (boxId as string) fetchBox();
  }, [boxId as string]);

  return (
    <RequireAuth>
      <main className="mt-8 w-full m-auto max-w-2xl">
        <div className="flex space-between w-full">
          <h1 className="text-4xl mr-auto font-bold">{box?.name}</h1>
          <UserAvatar size={48} />
        </div>

        {box?.description || <p className="text-gray-400">{box?.description}</p>}

        {error || <div className="text-red-600">{error}</div>}
      </main>
    </RequireAuth>
  );
}
