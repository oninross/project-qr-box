"use client";

import { doc, getDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { MoreVertical, Trash2, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState, useCallback } from "react";

import Breadcrumbs from "@/components/Breadcrumbs";
import RequireAuth from "@/components/RequireAuth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import UserAvatarMenu from "@/components/UserAvatarMenu";
import { db, storage } from "@/lib/firebase";

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

function BoxComponent() {
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

  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [accordionOpen, setAccordionOpen] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchBox() {
      setError("");
      try {
        const docRef = doc(db, "boxes", boxIdString);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBox(docSnap.data());
          setQrCodeUrl(docSnap.data().qrCodeUrl || null); // <-- Fetch QR code URL from Firestore
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

  const handleAccordionChange = useCallback((value: string | undefined) => {
    setAccordionOpen(value);
  }, []);

  // Delete box and its items
  async function handleDeleteBox() {
    if (!boxIdString) return;
    setDeleting(true);
    try {
      // 1. Delete all items in the box from the root items collection
      const itemsRef = collection(db, "items");
      const itemsSnap = await getDocs(itemsRef);
      const filteredItems = itemsSnap.docs.filter((doc) => doc.data().boxId === boxIdString);

      // 2. Delete each item's image from Storage (if it exists)
      const deleteImagePromises = filteredItems.map(async (itemDoc) => {
        const itemData = itemDoc.data();
        if (itemData.image) {
          try {
            // Extract the storage path from the download URL
            const matches = decodeURIComponent(itemData.image).match(/\/o\/(.*?)\?/);
            const storagePath = matches && matches[1] ? matches[1] : null;
            if (storagePath) {
              const imgRef = storageRef(storage, storagePath);
              await deleteObject(imgRef);
            }
          } catch {
            // Ignore errors for missing files
          }
        }
        // Delete the item document
        await deleteDoc(itemDoc.ref);
      });

      // 3. Delete the box's pattern file and QR code from Storage (if they exist)
      const boxDocRef = doc(db, "boxes", boxIdString);
      const boxDocSnap = await getDoc(boxDocRef);
      if (boxDocSnap.exists()) {
        const boxData = boxDocSnap.data();
        // Pattern file
        if (boxData.patternFileUrl) {
          try {
            const matches = decodeURIComponent(boxData.patternFileUrl).match(/\/o\/(.*?)\?/);
            const storagePath = matches && matches[1] ? matches[1] : null;
            if (storagePath) {
              const pattRef = storageRef(storage, storagePath);
              await deleteObject(pattRef);
            }
          } catch {}
        }
        // QR code file
        if (boxData.qrCodeUrl) {
          try {
            const matches = decodeURIComponent(boxData.qrCodeUrl).match(/\/o\/(.*?)\?/);
            const storagePath = matches && matches[1] ? matches[1] : null;
            if (storagePath) {
              const qrRef = storageRef(storage, storagePath);
              await deleteObject(qrRef);
            }
          } catch {}
        }
      }

      // 4. Wait for all item deletions (images and docs)
      await Promise.all(deleteImagePromises);

      // 5. Delete the box document itself
      await deleteDoc(boxDocRef);

      // Optionally, redirect or show a toast
      window.location.href = "/storage-hub";
    } catch (error) {
      console.error(error);
      setError("Failed to delete box. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  return (
    <RequireAuth>
      <main className="mt-8 mb-24 w-full m-auto max-w-2xl px-6">
        <div className="flex space-between w-full">
          <h1 className="text-4xl mr-auto font-bold">{box?.name ? box?.name : "..."}</h1>
          <UserAvatarMenu size={48} />
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <Breadcrumbs />

        {/* About Box Accordion styled as a Card */}
        <Card className="mb-6 p-0 cursor-pointer rounded-sm hover:shadow-lg transition w-full">
          <Accordion
            type="single"
            collapsible
            value={accordionOpen}
            onValueChange={handleAccordionChange}
          >
            <AccordionItem value="box-info">
              <AccordionTrigger className="p-0 cursor-pointer px-6 py-4 text-sm font-semibold">
                {accordionOpen ? "Hide marker" : "Display marker"}
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="py-4">
                  {!qrCodeUrl && <div>QR code not available.</div>}
                  {qrCodeUrl && (
                    <>
                      <Image
                        src={qrCodeUrl}
                        alt="QR & AR Marker"
                        width={320}
                        height={320}
                        className="rounded shadow"
                        style={{ width: "100%", height: "auto", margin: "auto", maxWidth: "320px" }}
                        unoptimized
                      />
                      <div className="flex justify-center mt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            const printWindow = window.open("");
                            if (printWindow) {
                              printWindow.document.write(`
                                <html>
                                  <head>
                                    <title>Print Marker</title>
                                    <style>
                                      body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                                      img { max-width: 100%; max-height: 100vh; }
                                    </style>
                                  </head>
                                  <body>
                                    <img src="${qrCodeUrl}" alt="QR & AR Marker" />
                                    <script>
                                      window.onload = function() { window.print(); }
                                    </script>
                                  </body>
                                </html>
                              `);
                              printWindow.document.close();
                            }
                          }}
                        >
                          Print marker
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

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
                    width={128}
                    height={128}
                    className="w-16 h-16 object-cover rounded"
                    style={{ objectFit: "cover", borderRadius: "0.375rem" }}
                    unoptimized={false}
                  />
                )}

                <CardContent className="p-0">
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
                  router.push(`/box-details?boxId=${boxId}&boxCode=${boxCode}`);
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

export default function BoxPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BoxComponent />
    </Suspense>
  );
}
