"use client";

import { addDoc, collection, Timestamp } from "firebase/firestore";
import { ArchiveRestore } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useCallback } from "react";
import { toast } from "sonner";

import Breadcrumbs from "@/components/Breadcrumbs";
import RequireAuth from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import UserAvatarMenu from "@/components/UserAvatarMenu";
import { db, auth } from "@/lib/firebase";

export default function AddBox() {
  const [boxName, setBoxName] = useState("");
  const [boxDescription, setBoxDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  async function generateUniqueBoxCode() {
    // Try up to 10 times to avoid infinite loop
    for (let i = 0; i < 10; i++) {
      const code = Math.floor(Math.random() * 999) + 1;
      // Check with API if code exists
      const res = await fetch("/api/boxCodeExists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boxCode: code }),
      });
      const data = await res.json();
      if (!data.exists) return code;
    }
    return null;
  }

  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (boxName.trim().length < 3) {
        setError("Box Name must be at least 3 characters.");
        return;
      }
      setError("");
      setSaving(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("You must be logged in.");
          setSaving(false);
          return;
        }
        const boxCode = await generateUniqueBoxCode();
        if (!boxCode) {
          setError("Could not generate a unique box code. Please try again.");
          setSaving(false);
          return;
        }
        const docRef = await addDoc(collection(db, "boxes"), {
          name: boxName.trim(),
          description: boxDescription.trim(),
          createdAt: Timestamp.now(),
          userId: user.uid,
          boxCode,
        });
        toast.success("Box created successfully!");
        setTimeout(() => {
          router.push(`/box?boxId=${docRef.id}&boxCode=${boxCode}`);
        }, 3000);
      } catch {
        setError("Failed to save box. Please try again.");
      } finally {
        setSaving(false);
      }
    },
    [boxName, boxDescription, router]
  );

  return (
    <RequireAuth>
      <main className="mt-8 w-full m-auto max-w-2xl px-6">
        <div className="flex space-between w-full">
          <h1 className="text-4xl mr-auto font-bold">New Box</h1>
          <UserAvatarMenu size={48} />
        </div>

        <Breadcrumbs />

        <form className="mt-8 space-y-6" onSubmit={handleSave}>
          <div>
            <label htmlFor="boxName" className="block text-sm font-medium mb-1">
              Box Name
            </label>
            <input
              id="boxName"
              name="boxName"
              type="text"
              className="bg-white w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter box name"
              required
              value={boxName}
              onChange={(e) => setBoxName(e.target.value)}
              disabled={saving}
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>
          <div>
            <label htmlFor="boxDescription" className="block text-sm font-medium mb-1">
              Box Description
            </label>
            <textarea
              id="boxDescription"
              name="boxDescription"
              className="bg-white w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe the box (optional)"
              rows={3}
              value={boxDescription}
              onChange={(e) => setBoxDescription(e.target.value)}
              disabled={saving}
            />
          </div>
          {/* Floating Action Button */}
          <Button
            type="submit"
            size="icon"
            className="fixed bottom-22 right-6 w-12 h-12 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 focus:outline-none z-50 transition-all duration-200 ease-out hover:scale-110"
            style={{ fontSize: 28 }}
            aria-label="Add"
            disabled={saving}
          >
            <ArchiveRestore />
          </Button>
        </form>
      </main>
    </RequireAuth>
  );
}
