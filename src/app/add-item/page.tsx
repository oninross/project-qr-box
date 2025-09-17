"use client";

import exifr from "exifr";
import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ImageIcon, Save } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, Suspense } from "react";
import { toast } from "sonner";

import RequireAuth from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UserAvatar from "@/components/UserAvatar";
import { db } from "@/lib/firebase";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler for image placeholder click (desktop: only file upload)
  const handleImageClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Handler for file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Get EXIF orientation
      try {
        const orientation = await exifr.orientation(file);
        setImgOrientation(orientation || 1); // Default to 1 if not found
      } catch {
        setImgOrientation(1);
      }

      // Read image for preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save handler
  const handleSave = async () => {
    if (!itemName || !imageSrc) {
      toast.error("Please provide an image, and name.");
      return;
    }
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        toast.error("User not authenticated.");
        return;
      }
      await addDoc(collection(db, "items"), {
        userId: user.uid,
        boxId: boxIdString,
        name: itemName,
        description: itemDescription,
        image: imageSrc,
        createdAt: serverTimestamp(),
      });
      toast.success("Item saved!");
      router.push(`/box?boxId=${boxIdString}&boxCode=${boxCode}`);
    } catch (error) {
      toast.error("Error saving item.");
      console.error(error);
    }
  };

  return (
    <RequireAuth>
      <main className="mt-8 w-full m-auto max-w-2xl px-6 relative min-h-screen">
        <div className="flex space-between w-full">
          <h1 className="text-4xl mr-auto font-bold">Add item</h1>
          <UserAvatar size={48} />
        </div>

        <Card className="rounded-sm mt-8">
          <CardContent>
            {/* Image placeholder icon */}
            <button
              type="button"
              className={`cursor-pointer w-48 h-48 flex items-center m-auto justify-center bg-gray-100 rounded mb-6 overflow-hidden relative ${imgOrientation ? `-exif-code${imgOrientation}` : ""}`}
              onClick={handleImageClick}
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
              capture="environment" // <-- This hints to use the camera if available
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {/* Item Name field */}
            <input
              type="text"
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            {/* Item Description field */}
            <textarea
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Item Description"
              rows={3}
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Floating Action Button */}
        <Button
          type="button"
          onClick={handleSave}
          className="fixed bottom-22 right-6 w-12 h-12 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 focus:outline-none z-50 transition-all duration-200 ease-out hover:scale-110"
          aria-label="Save"
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
