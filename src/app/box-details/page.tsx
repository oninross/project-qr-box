"use client";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Save } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { toast } from "sonner";

import Breadcrumbs from "@/components/Breadcrumbs";
import RequireAuth from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import UserAvatarMenu from "@/components/UserAvatarMenu";
import { db } from "@/lib/firebase";

function BoxDetailsPage() {
  const [boxName, setBoxName] = useState("");
  const [boxDescription, setBoxDescription] = useState("");
  const [qrSrc, setQrSrc] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [initialBoxName, setInitialBoxName] = useState("");
  const [initialBoxDescription, setInitialBoxDescription] = useState("");

  const searchParams = useSearchParams();
  const boxId = searchParams.get("boxId");
  const boxCode = searchParams.get("boxCode");
  const router = useRouter();

  useEffect(() => {
    async function fetchBox() {
      if (!boxId) return;
      try {
        const docRef = doc(db, "boxes", boxId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setBoxName(data.name || "");
          setBoxDescription(data.description || "");
          setInitialBoxName(data.name || "");
          setInitialBoxDescription(data.description || "");
        } else {
          setError("Box not found.");
        }
      } catch {
        setError("Failed to fetch box details.");
      }
    }
    fetchBox();
  }, [boxId]);

  useEffect(() => {
    async function fetchQr() {
      if (!boxId || !boxCode) return;
      try {
        const res = await fetch(`/api/getQrCode?boxId=${boxId}&boxCode=${boxCode}`);

        if (!res.ok) throw new Error("Failed to fetch QR code");
        const blob = await res.blob();
        console.log("RED ", blob);
        setQrSrc(URL.createObjectURL(blob));
      } catch {
        setQrSrc(null);
      }
    }
    fetchQr();
  }, [boxId, boxCode]);

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
        if (!boxId) {
          setError("Box ID is missing.");
          setSaving(false);
          return;
        }
        const docRef = doc(db, "boxes", boxId);
        await updateDoc(docRef, {
          name: boxName.trim(),
          description: boxDescription.trim(),
        });
        toast.success("Box updated successfully!");
        // Redirect to /box with query params
        const params = new URLSearchParams();
        if (boxId) params.append("boxId", boxId);
        if (boxCode) params.append("boxCode", boxCode);
        router.push(`/box?${params.toString()}`);
      } catch {
        setError("Failed to update box. Please try again.");
      } finally {
        setSaving(false);
      }
    },
    [boxName, boxDescription, boxId, boxCode, router]
  );

  const isUnchanged =
    boxName.trim() === initialBoxName.trim() &&
    boxDescription.trim() === initialBoxDescription.trim();

  return (
    <RequireAuth>
      <main className="mt-8 mb-24 w-full m-auto max-w-2xl px-6">
        <div className="flex space-between w-full">
          <h1 className="text-4xl mr-auto font-bold">Box Details</h1>
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
          {qrSrc && (
            <div className="w-full max-w-xs mx-auto rounded shadow" style={{ display: "block" }}>
              <Image
                src={qrSrc}
                alt="QR & Aruco Marker"
                width={320}
                height={320}
                className="rounded shadow"
                style={{ width: "100%", height: "auto" }}
                unoptimized
              />
            </div>
          )}

          {/* Floating Action Button */}
          <Button
            type="submit"
            size="icon"
            className="fixed bottom-22 right-6 w-12 h-12 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 focus:outline-none z-50 transition-all duration-200 ease-out hover:scale-110"
            style={{ fontSize: 28 }}
            aria-label="Add"
            disabled={saving || isUnchanged}
          >
            <Save />
          </Button>
        </form>
      </main>
    </RequireAuth>
  );
}

export default function AddItemPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BoxDetailsPage />
    </Suspense>
  );
}
