"use client";

import FirebaseAuthUI from "@/components/FirebaseAuthUI";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

export default function Home() {
  const [showBanner, setShowBanner] = useState(false);

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

        <h1 className="text-4xl font-bold text-center w-full">Your Storage, Smarter.</h1>
        <p className="text-center w-full">
          Print QR & ArUco markers, tag your boxes, and see what’s inside instantly with AR. No more
          digging.
        </p>

        <p className="text-center w-full">
          <strong>
            <em>YourJust point, scan, and find.</em>
          </strong>
        </p>

        <FirebaseAuthUI />

        <Button className="w-full max-w-xs">What is QR Box?</Button>
      </main>
    </div>
  );
}
