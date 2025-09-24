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
import React, { Suspense, useEffect } from "react";
import { toast } from "sonner";

import RequireAuth from "@/components/RequireAuth";
import { db } from "@/lib/firebase";

function FindItemComponent() {
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

          if (boxData.patternFileUrl) {
            window.sessionStorage.setItem("arjs-patt", boxData.patternFileUrl);
          }
        } else {
          toast.error("Box not found.");
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

  return (
    <RequireAuth>
      <iframe
        src="/ar-viewer.html"
        allow="camera; microphone; display-capture; fullscreen"
        sandbox="allow-scripts allow-same-origin allow-forms"
        style={{
          width: "100vw",
          height: "100vh",
          border: "none",
          margin: 0,
          padding: 0,
          overflow: "hidden",
          display: "block",
        }}
      />
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
