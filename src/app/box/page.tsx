"use client";

import { useSearchParams, useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import UserAvatar from "@/components/UserAvatar";
import { MoreVertical, Trash2, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface Box {
  name?: string;
  description?: string;
  // Add other fields as needed
}

interface Item {
  id: string;
  name: string;
  description: string;
  image?: string;
  boxId?: string;
  // Add other fields as needed
}

export default function Box() {
  const params = useSearchParams();
  const router = useRouter();
  const boxId = params.get("boxId");
  const boxCode = params.get("boxCode");
  const boxIdString = boxId as string;
  const [box, setBox] = useState<Box | null>(null);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Add a loading state for deletion
  const [deleting, setDeleting] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

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

    async function fetchItems() {
      try {
        const itemsRef = collection(db, "items");
        const itemsSnap = await getDocs(itemsRef);
        // Filter items by boxId
        const filteredItems: Item[] = itemsSnap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }) as Item)
          .filter((item) => item.boxId === boxIdString);
        setItems(filteredItems);
      } catch {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    }

    if (boxIdString) {
      setLoading(true);
      fetchBox();
      fetchItems();
    }
  }, [boxIdString]);

  // Delete box and its items
  async function handleDeleteBox() {
    if (!boxIdString) return;
    setDeleting(true);
    try {
      // Delete all items in the box (assuming a subcollection "items")
      const itemsRef = collection(db, "boxes", boxIdString, "items");
      const itemsSnap = await getDocs(itemsRef);
      const deletePromises = itemsSnap.docs.map((itemDoc) => deleteDoc(itemDoc.ref));
      await Promise.all(deletePromises);

      // Delete the box document itself
      await deleteDoc(doc(db, "boxes", boxIdString));

      // Optionally, redirect or show a toast
      window.location.href = "/locker-room";
    } catch (err) {
      setError("Failed to delete box. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  return (
    <RequireAuth>
      <main className="mt-8 w-full m-auto max-w-2xl px-6">
        <div className="flex space-between w-full">
          <h1 className="text-4xl mr-auto font-bold">{box?.name}</h1>
          <UserAvatar size={48} />
        </div>

        {box?.description && <p className="text-gray-400 mb-4">{box?.description}</p>}

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Loading, Empty, or Cards */}
        {loading ? (
          <p>
            <strong>
              <em>Opening your box</em>
            </strong>
          </p>
        ) : items.length === 0 ? (
          <p>Your box is currently empty</p>
        ) : (
          <div className="flex flex-wrap gap-4 mb-8">
            {items.map((item) => (
              <Card
                key={item.id}
                onClick={() =>
                  router.push(`/item?boxId=${boxId}&boxCode=${boxCode}&itemId=${item.id}`)
                }
                className="flex flex-row items-center gap-4 p-4 cursor-pointer rounded-sm hover:shadow-lg transition w-full"
                style={{ outline: "none" }}
                role="button"
                tabIndex={0}
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={200}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}

                <CardContent>
                  <p className="font-semibold">{item.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

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
                  setShowDeleteModal(true);
                }}
              >
                Delete box <Trash2 className="mr-2" size={18} />
              </Button>
              <Button
                variant="ghost"
                className="flex items-center w-full px-4 py-2 text-right text-gray-800 hover:bg-gray-100 justify-end text-right"
                onClick={() => {
                  setMenuOpen(false); /* TODO: View box details logic */
                  router.push(`/box-detail?boxId=${boxId}&boxCode=${boxCode}`);
                }}
              >
                View box details <Pencil className="mr-2" size={18} />
              </Button>
              <Button
                variant="ghost"
                className="flex items-center w-full px-4 py-2 text-right text-green-700 hover:bg-gray-100 justify-end text-right"
                onClick={() => {
                  setMenuOpen(false);
                  router.push(`/add-item?boxId=${boxId}&boxCode=${boxCode}`);
                }}
              >
                Add item <Plus className="mr-2" size={18} />
              </Button>
            </div>
          )}
        </div>

        {/* Delete Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Box</DialogTitle>
            </DialogHeader>
            <p className="py-4">
              Deleting this box will permanently remove all stored items and photos linked to it.
              This action cannot be undone. Do you wish to continue?
            </p>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteBox} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </RequireAuth>
  );
}
