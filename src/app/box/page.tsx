"use client";
import { useSearchParams } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";

export default function BoxDetail() {
  const params = useSearchParams();
  const boxId = params.get("boxId");
  const boxCode = params.get("boxCode");

  return (
    <RequireAuth>
      <main className="mt-8 w-full m-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">Box Details</h1>
        <div className="mb-4">
          <span className="font-mono text-green-700">Box ID:</span>
          <span className="ml-2 font-mono text-green-900">{boxId}</span>
        </div>
        <div className="mb-4">
          <span className="font-mono text-green-700">Box Code:</span>
          <span className="ml-2 font-mono text-green-900">{boxCode}</span>
        </div>
        {/* TODO: Fetch and display box details here */}
      </main>
    </RequireAuth>
  );
}
