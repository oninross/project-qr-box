"use client";

import FirebaseAuthUI from "@/components/FirebaseAuthUI";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex items-center justify-center p-8 pb-20 sm:p-20">
      <main className="flex flex-col gap-8 items-center w-full max-w-md">
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
