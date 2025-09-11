"use client";
import { useEffect, useRef } from "react";
import RequireAuth from "@/components/RequireAuth";

export default function Scan() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert("Could not access camera: " + (err instanceof Error ? err.message : err));
      }
    }
    enableCamera();

    // Capture the current value of videoRef.current
    const currentVideo = videoRef.current;

    return () => {
      if (currentVideo && currentVideo.srcObject) {
        const tracks = (currentVideo.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <RequireAuth>
      <div className="fixed inset-0 w-full h-full bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ background: "black" }}
        />
      </div>
    </RequireAuth>
  );
}
