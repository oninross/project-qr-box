"use client";

import { doc, getDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import RequireAuth from "@/components/RequireAuth";
import { db } from "@/lib/firebase";

const markerWidth = 1; // 1 meter wide marker

export default function FindItem() {
  const [patternFile, setPatternFile] = useState<string | null>(null);
  const [itemImage, setItemImage] = useState<string | null>(null);
  const [imageAspect, setImageAspect] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const boxId = searchParams.get("boxId");
  const itemId = searchParams.get("itemId");

  useEffect(() => {
    async function fetchPatternAndImage() {
      if (!boxId || !itemId) return;

      try {
        // Fetch the box document for pattern file
        const boxDoc = await getDoc(doc(db, "boxes", boxId));
        if (boxDoc.exists()) {
          const boxData = boxDoc.data();
          setPatternFile(boxData.patternFile || null);
        } else {
          toast.error("Box not found.");
        }

        // Fetch the item document for image
        const itemDoc = await getDoc(doc(db, "items", itemId));
        if (itemDoc.exists()) {
          const itemData = itemDoc.data();
          setItemImage(itemData.image || null);

          // Dynamically get image aspect ratio
          if (itemData.image) {
            const img = new window.Image();
            img.onload = () => {
              setImageAspect(img.width / img.height);
            };
            img.src = itemData.image;
          }
        } else {
          toast.error("Item not found.");
        }
      } catch (err) {
        toast.error("Failed to fetch pattern file or item image.");
      }
    }
    fetchPatternAndImage();
  }, [boxId, itemId]);

  // Calculate height based on aspect ratio and marker width
  const imageHeight = imageAspect ? markerWidth / imageAspect : 1;

  return (
    <RequireAuth>
      {/* @ts-expect-error: custom elements not recognized by TypeScript */}
      <a-scene
        embedded
        arjs="debugUIEnabled: false; maxDetectionRate: 30; trackingMethod: best; patternRatio: 0.9;"
      >
        {/* @ts-expect-error: custom elements not recognized by TypeScript */}
        <a-camera-static />

        {patternFile && itemImage && imageAspect && (
          // @ts-expect-error: custom elements not recognized by TypeScript
          <a-marker type="pattern" url={patternFile}>
            {/* @ts-expect-error: custom elements not recognized by TypeScript */}
            <a-image
              src={itemImage}
              width={markerWidth}
              height={imageHeight}
              position="0 0 0"
              rotation="-90 0 0"
            />
            {/* @ts-expect-error: custom elements not recognized by TypeScript */}
          </a-marker>
        )}
        {/* @ts-expect-error: custom elements not recognized by TypeScript */}
      </a-scene>
    </RequireAuth>
  );
}
