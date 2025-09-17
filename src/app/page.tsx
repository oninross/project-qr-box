"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const FirebaseAuthUI = dynamic(() => import("@/components/FirebaseAuthUI"), { ssr: false });
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
export default function Home() {
  const [showBanner, setShowBanner] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for inactivity logout flag in localStorage
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("qrbox-logout-inactivity") === "1") {
        setShowBanner(true);
        window.localStorage.removeItem("qrbox-logout-inactivity");
      }
    }
  }, []);

  return (
    <div className="font-sans min-h-screen flex items-center justify-center p-8 pb-20 sm:p-20">
      <main className="flex flex-col gap-8 items-center w-full max-w-md">
        {showBanner && (
          <Alert className="mb-4 text-center" variant="default">
            You have been logged out due to inactivity
          </Alert>
        )}

        <h1 className="text-4xl font-bold text-center w-full">Welcome to your Bodega</h1>
        <p className="text-center w-full">
          Print QR & AR markers, tag your boxes, and see what’s inside instantly with AR. No more
          digging.
        </p>

        <p className="text-center w-full">
          <strong>
            <em>Just point, scan, and find.</em>
          </strong>
        </p>

        <FirebaseAuthUI />

        <Button className="w-full max-w-xs" onClick={() => router.push("/what-is-bodega")}>
          What is Bodega?
        </Button>
      </main>
    </div>
  );
}
