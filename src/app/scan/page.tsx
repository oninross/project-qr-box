"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect } from "react";
import { toast } from "sonner";

import RequireAuth from "@/components/RequireAuth";

export default function Scan() {
  const scannerId = "qr-scanner";

  useEffect(() => {
    // Lock body and html to viewport size and prevent scroll
    document.body.style.overflow = "hidden";
    document.body.style.width = "100vw";
    document.body.style.height = "100vh";
    document.documentElement.style.width = "100vw";
    document.documentElement.style.height = "100vh";

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      toast.error("Missing NEXT_PUBLIC_BASE_URL environment variable.");
      return;
    }

    let html5QrCode: Html5Qrcode | null = null;
    let cancelled = false;
    let hasScanned = false;

    function startScanner() {
      const el = document.getElementById(scannerId);
      if (!el) {
        setTimeout(startScanner, 100);
        return;
      }

      html5QrCode = new Html5Qrcode(scannerId);

      html5QrCode
        .start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: () => {
              return { width: 300, height: 300 };
            },
            aspectRatio: window.innerWidth / window.innerHeight,
          },
          async (decodedText) => {
            if (hasScanned) return;
            if (decodedText.includes(baseUrl as string)) {
              hasScanned = true;
              if (html5QrCode) {
                await html5QrCode.stop().catch(() => {});
              }
              toast.success(`Redirecting to ${decodedText}`);
              setTimeout(() => {
                window.location.href = decodedText;
              }, 1200);
            }
          },
          () => {
            // Optional: handle scan errors
          }
        )
        .catch((err) => {
          if (!cancelled) toast.error("Could not access camera: " + err);
        });
    }

    if (typeof window !== "undefined") {
      startScanner();
    }

    // Try to make the video element fill the screen
    const interval = setInterval(() => {
      const video = document.querySelector(`#${scannerId} video`) as HTMLVideoElement | null;
      if (video) {
        video.style.objectFit = "cover";
        video.style.width = "100vw";
        video.style.height = "100vh";
        video.setAttribute("playsinline", "true");
        clearInterval(interval);
      }
    }, 200);

    return () => {
      cancelled = true;
      if (html5QrCode) {
        html5QrCode.stop().catch(() => {});
        try {
          html5QrCode.clear();
        } catch {}
      }
      // Restore body/html styles
      document.body.style.overflow = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.documentElement.style.width = "";
      document.documentElement.style.height = "";
      clearInterval(interval);
    };
  }, []);

  return (
    <RequireAuth>
      <div
        className="fixed inset-0 w-screen h-screen bg-black flex flex-col items-center justify-center"
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
        }}
      >
        <div
          id={scannerId}
          className="absolute inset-0 w-full h-full bg-black"
          style={{ zIndex: 10, width: "100vw", height: "100vh" }}
        />
      </div>
    </RequireAuth>
  );
}
