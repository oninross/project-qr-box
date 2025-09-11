"use client";

import { useSearchParams } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import UserAvatar from "@/components/UserAvatar";
import { MoreVertical, Trash2, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface Box {
  name?: string;
  description?: string;
  // Add other fields as needed
}

export default function Box() {
  const params = useSearchParams();
  const boxId = params.get("boxId");
  const boxCode = params.get("boxCode");
  const boxIdString = boxId as string;
  const [box, setBox] = useState<Box | null>(null);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchBox() {
      setError("");
      try {
        const docRef = doc(db, "boxes", boxIdString);
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
    if (boxIdString) fetchBox();
  }, [boxIdString]);

  return (
    <RequireAuth>
      <main className="mt-8 w-full m-auto max-w-2xl">
        <div className="flex space-between w-full">
          <h1 className="text-4xl mr-auto font-bold">{box?.name}</h1>
          <UserAvatar size={48} />
        </div>

        {box?.description && <p className="text-gray-400">{box?.description}</p>}

        {error && <div className="text-red-600">{error}</div>}

        {/* Floating Action Button with Menu */}
        <div className="fixed bottom-22 right-6 z-50">
          <Button
            size="icon"
            className="cursor-pointer w-12 h-12 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 focus:outline-none transition-all duration-200 ease-out hover:scale-110"
            style={{ fontSize: 28 }}
            aria-label="Actions"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MoreVertical />
          </Button>

          {menuOpen && (
            <div className="absolute bottom-14 right-0 bg-white border rounded-lg shadow-lg py-2 w-48 animate-fade-in">
              <Button
                variant="ghost"
                className="flex items-center w-full px-4 py-2 text-right text-red-600 hover:bg-gray-100 justify-end text-right"
                onClick={() => {
                  setMenuOpen(false); /* TODO: Delete box logic */
                }}
              >
                Delete box <Trash2 className="mr-2" size={18} />
              </Button>
              <Button
                variant="ghost"
                className="flex items-center w-full px-4 py-2 text-right text-gray-800 hover:bg-gray-100 justify-end text-right"
                onClick={() => {
                  setMenuOpen(false); /* TODO: Edit box details logic */
                }}
              >
                Edit box details <Pencil className="mr-2" size={18} />
              </Button>
              <Button
                variant="ghost"
                className="flex items-center w-full px-4 py-2 text-right text-green-700 hover:bg-gray-100 justify-end text-right"
                onClick={() => {
                  setMenuOpen(false); /* TODO: Add item logic */
                }}
              >
                Add item <Plus className="mr-2" size={18} />
              </Button>
            </div>
          )}
        </div>
      </main>
    </RequireAuth>
  );
}
