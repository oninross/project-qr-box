"use client";
import { useEffect } from "react";
import RequireAuth from "@/components/RequireAuth";
import { Html5Qrcode } from "html5-qrcode";
import { toast, Toaster } from "sonner";

export default function Scan() {
  const scannerId = "qr-scanner";

  useEffect(() => {
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
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
              const boxSize = Math.floor(minEdge * 0.8);
              return { width: boxSize, height: boxSize };
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
          (err) => {
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

    return () => {
      cancelled = true;
      if (html5QrCode) {
        html5QrCode.stop().catch(() => {});
        try {
          html5QrCode.clear();
        } catch {}
      }
    };
  }, []);

  return (
    <RequireAuth>
      <div className="fixed inset-0 w-full h-full bg-black flex flex-col items-center justify-center">
        <div
          id={scannerId}
          className="absolute inset-0 w-full h-full bg-black"
          style={{ zIndex: 10 }}
        />
      </div>
    </RequireAuth>
  );
}
