"use client";

import Image from "next/image";
import React, { useEffect } from "react";

import RequireAuth from "@/components/RequireAuth";

export default function SearchItem() {
  useEffect(() => {
    // Dynamically load A-Frame and AR.js scripts if not already loaded
    const aframeId = "aframe-script";
    const arjsId = "arjs-script";
    if (!document.getElementById(aframeId)) {
      const script = document.createElement("script");
      script.id = aframeId;
      script.src = "https://aframe.io/releases/1.4.2/aframe.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
    if (!document.getElementById(arjsId)) {
      const script = document.createElement("script");
      script.id = arjsId;
      script.src = "https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/aframe/build/aframe-ar.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <RequireAuth>
      <div className="fixed inset-0 w-full h-full bg-black flex flex-col items-center justify-center">
        {/* @ts-expect-error: a-scene and a-camera-static are custom elements not recognized by TypeScript */}
        <a-scene
          embedded
          arjs="debugUIEnabled: false; maxDetectionRate: 30; trackingMethod: best; patternRatio: 0.9;"
        >
          {/* @ts-expect-error: a-assets is a custom element not recognized by TypeScript */}
          <a-assets>
            <Image
              id="target"
              src="/target-lock.png"
              alt="Target lock"
              width={128}
              height={128}
              unoptimized
            />
            {/* @ts-expect-error: img is a custom element not recognized by TypeScript */}
          </a-assets>
          {/* @ts-expect-error: a-camera-static is a custom element not recognized by TypeScript */}
          <a-camera-static />
          {/* @ts-expect-error: a-scene and a-camera-static are custom elements not recognized by TypeScript */}
        </a-scene>
      </div>
    </RequireAuth>
  );
}
