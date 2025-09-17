"use client";

import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { Save, Trash2, MoreVertical, ScanSearch } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { toast } from "sonner";

import Breadcrumbs from "@/components/Breadcrumbs";
import RequireAuth from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import UserAvatarMenu from "@/components/UserAvatarMenu";
import { db } from "@/lib/firebase";

function ItemComponent() {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemImage, setItemImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [initialItemName, setInitialItemName] = useState("");
  const [initialItemDescription, setInitialItemDescription] = useState("");
  const [, setInitialItemImage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const searchParams = useSearchParams();
  const boxId = searchParams.get("boxId");
  const boxCode = searchParams.get("boxCode");
  const itemId = searchParams.get("itemId");
  const router = useRouter();

  useEffect(() => {
    async function fetchItem() {
      if (!itemId) return;
      try {
        const docRef = doc(db, "items", itemId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setItemName(data.name || "");
          setItemDescription(data.description || "");
          setItemImage(data.image || null);
          setInitialItemName(data.name || "");
          setInitialItemDescription(data.description || "");
          setInitialItemImage(data.image || null);
        } else {
          setError("Item not found.");
        }
      } catch {
        setError("Failed to fetch item details.");
      }
    }
    fetchItem();
  }, [itemId]);

  const handleSave = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (itemName.trim().length < 3) {
        setError("Item Name must be at least 3 characters.");
        return;
      }
      setError("");
      setSaving(true);
      try {
        if (!itemId) {
          setError("Item ID is missing.");
          setSaving(false);
          return;
        }
        const docRef = doc(db, "items", itemId);
        await updateDoc(docRef, {
          name: itemName.trim(),
          description: itemDescription.trim(),
        });
        toast.success("Item updated successfully!");
        // Redirect to /box with query params
        const params = new URLSearchParams();
        if (boxId) params.append("boxId", boxId);
        if (boxCode) params.append("boxCode", boxCode);
        router.push(`/box?${params.toString()}`);
      } catch {
        setError("Failed to update item. Please try again.");
      } finally {
        setSaving(false);
      }
    },
    [itemName, itemDescription, itemId, router, boxId, boxCode]
  );

  // Delete item logic
  const handleDelete = async () => {
    if (!itemId) return;
    setDeleting(true);
    try {
      // Delete the item document
      await deleteDoc(doc(db, "items", itemId));
      // TODO: Delete image from storage if needed
      toast.success("Item deleted successfully!");
      // Redirect to box page
      const params = new URLSearchParams();
      if (boxId) params.append("boxId", boxId);
      if (boxCode) params.append("boxCode", boxCode);
      router.push(`/box?${params.toString()}`);
    } catch {
      toast.error("Failed to delete item.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Find item logic (with Sonner alert)
  const handleFind = () => {
    if (boxId && itemId) {
      router.push(
        `/find-item?boxId=${encodeURIComponent(boxId)}&itemId=${encodeURIComponent(itemId)}`
      );
    }
  };

  const isUnchanged =
    itemName.trim() === initialItemName.trim() &&
    itemDescription.trim() === initialItemDescription.trim();

  useEffect(() => {
    if (saving) {
      document.body.style.cursor = "wait";
    } else {
      document.body.style.cursor = "";
    }
    return () => {
      document.body.style.cursor = "";
    };
  }, [saving]);

  useEffect(() => {
    if (deleting) {
      document.body.style.cursor = "wait";
    } else {
      document.body.style.cursor = "";
    }
    return () => {
      document.body.style.cursor = "";
    };
  }, [deleting]);

  return (
    <RequireAuth>
      <main className="mt-8 mb-24 w-full m-auto max-w-2xl px-6">
        <div className="flex space-between w-full">
          <h1 className="text-4xl mr-auto font-bold">Item Details</h1>
          <UserAvatarMenu size={48} />
        </div>

        <Breadcrumbs />

        <form className="mt-8" onSubmit={handleSave}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Fields on the left */}
            <div className="w-full md:w-1/2 flex-1">
              <div>
                <label htmlFor="itemName" className="block text-sm font-medium mb-1">
                  Item Name
                </label>
                <input
                  id="itemName"
                  name="itemName"
                  type="text"
                  className="bg-white w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter item name"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  disabled={saving}
                />
                {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
              </div>
              <div className="mt-4">
                <label htmlFor="itemDescription" className="block text-sm font-medium mb-1">
                  Item Description
                </label>
                <textarea
                  id="itemDescription"
                  name="itemDescription"
                  className="bg-white w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Describe the item (optional)"
                  rows={3}
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>
            {/* Image on the right */}
            <div className="w-full md:w-1/2 flex items-center justify-center">
              {itemImage && (
                <Image
                  src={itemImage}
                  alt="Item"
                  className="w-full rounded shadow"
                  style={{ display: "block" }}
                  width={0}
                  height={0}
                  unoptimized={false}
                  priority
                />
              )}
            </div>
          </div>
        </form>

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
                  setMenuOpen(false);
                  setShowDeleteModal(true); // This opens the modal
                }}
              >
                Delete item <Trash2 className="mr-2" size={18} />
              </Button>
              <Button
                variant="ghost"
                className="flex items-center w-full px-4 py-2 text-right text-gray-800 hover:bg-gray-100 justify-end text-right"
                onClick={() => {
                  setMenuOpen(false);
                  handleFind();
                }}
              >
                Find item <ScanSearch className="mr-2" size={18} />
              </Button>
              <Button
                variant="ghost"
                className="flex items-center w-full px-4 py-2 text-right text-green-700 hover:bg-gray-100 justify-end text-right"
                onClick={async () => {
                  setMenuOpen(false);
                  // Create a synthetic event with the correct type for handleSave
                  await handleSave({
                    preventDefault: () => {},
                  } as React.FormEvent<HTMLFormElement>);
                }}
                disabled={saving || isUnchanged}
              >
                Update changes <Save className="mr-2" size={18} />
              </Button>
            </div>
          )}
        </div>

        {/* Delete confirmation dialog */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Item</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this item? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-4 justify-end">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </RequireAuth>
  );
}

export default function ItemPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ItemComponent />
    </Suspense>
  );
}
