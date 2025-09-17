"use client";

import { doc, getDoc } from "firebase/firestore";
declare global {
  interface Window {
    AFRAME?: {
      scenes?: unknown[];
    };
  }
}
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import RequireAuth from "@/components/RequireAuth";
import { db } from "@/lib/firebase";

const markerWidth = 1; // 1 meter wide marker

function FindItemComponent() {
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
        toast.error(`Failed to fetch pattern file or item image. (${err})`);
      }
    }
    fetchPatternAndImage();

    return () => {
      // Remove the a-scene from the DOM
      const sceneEl = document.querySelector("a-scene");
      if (sceneEl && sceneEl.parentNode) {
        sceneEl.parentNode.removeChild(sceneEl);
      }

      // Stop all video streams and remove video elements from DOM
      const videos = document.querySelectorAll("video");
      videos.forEach((video) => {
        if (video.srcObject) {
          const tracks = (video.srcObject as MediaStream).getTracks();
          tracks.forEach((track) => track.stop());
        }
        if (video.parentNode) {
          video.parentNode.removeChild(video);
        }
      });

      // Remove any inline styles on the body
      document.body.removeAttribute("style");
      document.body.style.width = "";
      document.body.style.height = "";
      document.body.style.marginLeft = "";
      document.body.style.marginTop = "";
      document.body.style.background = "";

      // Remove all listeners from window
      window.onresize = null;
      window.onorientationchange = null;

      // Attempt to clear global AFRAME scenes
      if (window.AFRAME && window.AFRAME.scenes) {
        window.AFRAME.scenes.length = 0;
      }

      // --- FORCE FULL PAGE RELOAD ---
      // This is the only way to guarantee all AR.js listeners are gone
      setTimeout(() => {
        if (window.location.pathname !== "/find-item") {
          window.location.reload();
        }
      }, 100);
    };
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

export default function FindItemPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FindItemComponent />
    </Suspense>
  );
}
