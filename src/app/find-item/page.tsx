"use client";

import { doc, getDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import RequireAuth from "@/components/RequireAuth";
import { db } from "@/lib/firebase";

export default function FindItem() {
  const [patternFile, setPatternFile] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const boxId = searchParams.get("boxId");

  useEffect(() => {
    async function fetchPattern() {
      if (!boxId) return;

      try {
        // Fetch the box document using boxId from query params
        const boxDoc = await getDoc(doc(db, "boxes", boxId));
        if (boxDoc.exists()) {
          const boxData = boxDoc.data();
          setPatternFile(boxData.patternFile || null);
        } else {
          toast.error("Box not found.");
        }
      } catch (err) {
        toast.error("Failed to fetch pattern file.");
      }
    }
    fetchPattern();
  }, [boxId]);

  return (
    <RequireAuth>
      {/* @ts-expect-error: custom elements not recognized by TypeScript */}
      <a-scene
        embedded
        arjs="debugUIEnabled: false; maxDetectionRate: 30; trackingMethod: best; patternRatio: 0.9;"
      >
        {/* @ts-expect-error: custom elements not recognized by TypeScript */}
        <a-camera-static />

        {patternFile && (
          // @ts-expect-error: a-marker is a custom element not recognized by TypeScript
          <a-marker type="pattern" url={patternFile}>
            {/* @ts-expect-error: custom elements not recognized by TypeScript */}
            <a-entity scale="0.35 0.35 0.35">
              {/* @ts-expect-error: custom elements not recognized by TypeScript */}
              <a-box
                position="-1.65 0 0"
                rotation="0 0 0"
                scale="0.2 0.04 0.04"
                color="#f7bf00"
                shadow=""
              />
              {/* @ts-expect-error: custom elements not recognized by TypeScript */}
              <a-box
                position="1.65 0 0"
                rotation="0 0 0"
                scale="0.2 0.04 0.04"
                color="#f7bf00"
                shadow=""
              />
              {/* @ts-expect-error: custom elements not recognized by TypeScript */}
              <a-box
                position="0 0 -1.65"
                rotation="0 0 0"
                scale="0.04 0.04 0.2"
                color="#f7bf00"
                shadow=""
              />
              {/* @ts-expect-error: custom elements not recognized by TypeScript */}
              <a-box
                position="0 0 1.65"
                rotation="0 0 0"
                scale="0.04 0.04 0.2"
                color="#f7bf00"
                shadow=""
              />
              {/* @ts-expect-error: custom elements not recognized by TypeScript */}
              <a-box
                position="0 0 -1.4"
                rotation="0 0 0"
                scale="2.88 0.08 0.08"
                color="#f7bf00"
                shadow=""
              />
              {/* @ts-expect-error: custom elements not recognized by TypeScript */}
              <a-box
                position="0 0 1.4"
                rotation="0 0 0"
                scale="2.88 0.08 0.08"
                color="#f7bf00"
                shadow=""
              />
              {/* @ts-expect-error: custom elements not recognized by TypeScript */}
              <a-box
                position="-1.4 0 0"
                rotation="0 0 0"
                scale="0.08 0.08 2.88"
                color="#f7bf00"
                shadow=""
              />
              {/* @ts-expect-error: custom elements not recognized by TypeScript */}
              <a-box
                position="1.4 0 0"
                rotation="0 0 0"
                scale="0.08 0.08 2.88"
                color="#f7bf00"
                shadow=""
              />
              {/* @ts-expect-error: custom elements not recognized by TypeScript */}
              <a-entity rotation="0 45 0" scale="0.62 0.62 0.62">
                {/* @ts-expect-error: custom elements not recognized by TypeScript */}
                <a-box
                  position="0 0 -1.4"
                  rotation="0 0 0"
                  scale="2.88 0.08 0.08"
                  color="#f7bf00"
                  shadow=""
                />
                {/* @ts-expect-error: custom elements not recognized by TypeScript */}
                <a-box
                  position="0 0 1.4"
                  rotation="0 0 0"
                  scale="2.88 0.08 0.08"
                  color="#f7bf00"
                  shadow=""
                />
                {/* @ts-expect-error: custom elements not recognized by TypeScript */}
                <a-box
                  position="-1.4 0 0"
                  rotation="0 0 0"
                  scale="0.08 0.08 2.88"
                  color="#f7bf00"
                  shadow=""
                />
                {/* @ts-expect-error: custom elements not recognized by TypeScript */}
                <a-box
                  position="1.4 0 0"
                  rotation="0 0 0"
                  scale="0.08 0.08 2.88"
                  color="#f7bf00"
                  shadow=""
                />
                {/* @ts-expect-error: custom elements not recognized by TypeScript */}
              </a-entity>
              {/* @ts-expect-error: custom elements not recognized by TypeScript */}
              <a-box
                position="0 0 0"
                rotation="0 0 0"
                scale="0.120 0.120 0.120"
                color="#f7bf00"
                shadow=""
              />
              {/* @ts-expect-error: custom elements not recognized by TypeScript */}
            </a-entity>
            {/* @ts-expect-error: custom elements not recognized by TypeScript */}
          </a-marker>
        )}
        {/* @ts-expect-error: custom elements not recognized by TypeScript */}
      </a-scene>
    </RequireAuth>
  );
}
