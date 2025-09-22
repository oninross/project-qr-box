"use client";

import exifr from "exifr";
import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ImageIcon, Save } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, Suspense, useEffect } from "react";
import { toast } from "sonner";

import RequireAuth from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UserAvatarMenu from "@/components/UserAvatarMenu";
import { db, storage } from "@/lib/firebase";

function AddItemComponent() {
  const params = useSearchParams();
  const router = useRouter();
  const boxId = params.get("boxId");
  const boxCode = params.get("boxCode");
  const boxIdString = boxId as string;

  const [itemName, setItemName] = useState<string>("");
  const [itemDescription, setItemDescription] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imgOrientation, setImgOrientation] = useState<number | null>(null);
  const [saving, setSaving] = useState(false); // Add saving state
  const [itemCount, setItemCount] = useState<number>(0);
  const maxItems = 10;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch item count for this box
  useEffect(() => {
    async function fetchItemCount() {
      if (!boxIdString) return;
      try {
        const q = query(collection(db, "items"), where("boxId", "==", boxIdString));
        const snapshot = await getDocs(q);
        setItemCount(snapshot.size);
      } catch (error) {
        toast.error(`Failed to fetch item count. (${error})`);
        setItemCount(0);
      }
    }
    fetchItemCount();
  }, [boxIdString]);

  // Handler for image placeholder click (desktop: only file upload)
  const handleImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Handler for file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file); // keep raw file for upload
    setImageSrc(URL.createObjectURL(file)); // preview only

    // Optional: still grab EXIF orientation
    try {
      const orientation = await exifr.orientation(file);
      setImgOrientation(orientation || 1);
    } catch {
      setImgOrientation(1);
    }
  };

  // Save handler
  const handleSave = async () => {
    if (itemCount >= maxItems) {
      toast.error("You can only add up to 10 items in a box.");
      return;
    }
    if (!itemName || !selectedFile) {
      toast.error("Please provide an image and name.");
      return;
    }

    setSaving(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        toast.error("User not authenticated.");
        setSaving(false);
        return;
      }

      // Upload raw file
      const imagePath = `items/${boxIdString}/${Date.now()}_${user.uid}.jpg`;
      const imageRef = ref(storage, imagePath);

      await uploadBytes(imageRef, selectedFile, {
        contentType: selectedFile.type, // ensure correct MIME type
      });

      // Get download URL
      const imageUrl = await getDownloadURL(imageRef);

      // Save item in Firestore
      await addDoc(collection(db, "items"), {
        userId: user.uid,
        boxId: boxIdString,
        name: itemName,
        description: itemDescription,
        image: imageUrl,
        createdAt: serverTimestamp(),
      });

      toast.success("Item saved!");
      router.push(`/box?boxId=${boxIdString}&boxCode=${boxCode}`);
    } catch (error) {
      toast.error(`Error saving item. (${error})`);
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <RequireAuth>
      <main className="mt-8 w-full m-auto max-w-2xl px-6 relative min-h-screen">
        <div className="flex space-between w-full">
          <h1 className="text-4xl mr-auto font-bold">Add item</h1>
          <UserAvatarMenu size={48} />
        </div>

        <Card className="rounded-sm mt-8">
          <CardContent>
            {/* Image placeholder icon */}
            <button
              type="button"
              className={`cursor-pointer w-48 h-48 flex items-center m-auto justify-center bg-gray-100 rounded mb-6 overflow-hidden relative ${imgOrientation ? `-exif-code${imgOrientation}` : ""}`}
              onClick={handleImageClick}
              disabled={saving} // Disable while saving
              aria-disabled={saving}
            >
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt="Selected"
                  className="object-cover w-full h-full"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="192px"
                  priority
                />
              ) : (
                <ImageIcon size={48} className="text-gray-400" />
              )}
            </button>
            {/* Hidden file input for fallback */}
            <input
              type="file"
              accept="image/*"
              name="file"
              capture="environment"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              disabled={saving} // Disable while saving
              aria-disabled={saving}
            />
            {/* Item Name field */}
            <input
              type="text"
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              disabled={saving} // Disable while saving
              aria-disabled={saving}
            />
            {/* Item Description field */}
            <textarea
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Item Description"
              rows={3}
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              disabled={saving} // Disable while saving
              aria-disabled={saving}
            />
          </CardContent>
        </Card>

        {itemCount >= maxItems && (
          <div className="text-red-600 text-center mt-4">
            This box already has the maximum of {maxItems} items.
          </div>
        )}

        {/* Floating Action Button */}
        <Button
          type="button"
          onClick={handleSave}
          className="fixed bottom-22 right-6 w-12 h-12 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 focus:outline-none z-50 transition-all duration-200 ease-out hover:scale-110"
          aria-label="Save"
          disabled={saving || itemCount >= maxItems}
        >
          <Save />
        </Button>
      </main>
    </RequireAuth>
  );
}

export default function AddItemPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddItemComponent />
    </Suspense>
  );
}
