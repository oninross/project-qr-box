"use client";

import UserAvatarMenu from "@/components/UserAvatarMenu";
import RequireAuth from "@/components/RequireAuth";
import { ArchiveRestore } from "lucide-react";

import React, { useState } from "react";

export default function AddBox() {
  const [boxName, setBoxName] = useState("");
  const [boxDescription, setBoxDescription] = useState("");
  const [error, setError] = useState("");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (boxName.trim().length < 3) {
      setError("Box Name must be at least 3 characters.");
      return;
    }
    setError("");
    // TODO: Save logic here
    alert("Box saved!");
  }

  return (
    <RequireAuth>
      <main className="mt-8 w-full m-auto max-w-2xl">
        <div className="flex space-between w-full">
          <h1 className="text-4xl mr-auto font-bold">New Box</h1>
          <UserAvatarMenu size={48} />
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSave}>
          <div>
            <label htmlFor="boxName" className="block text-sm font-medium mb-1">
              Box Name
            </label>
            <input
              id="boxName"
              name="boxName"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter box name"
              required
              value={boxName}
              onChange={(e) => setBoxName(e.target.value)}
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>
          <div>
            <label htmlFor="boxDescription" className="block text-sm font-medium mb-1">
              Box Description
            </label>
            <textarea
              id="boxDescription"
              name="boxDescription"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe the box (optional)"
              rows={3}
              value={boxDescription}
              onChange={(e) => setBoxDescription(e.target.value)}
            />
          </div>
          {/* Floating Action Button */}
          <button
            type="submit"
            className="fixed cursor-pointer bottom-22 right-6 w-12 h-12 leading-none rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg hover:bg-green-700 focus:outline-none z-50 transition-all duration-200 ease-out hover:scale-110"
            style={{ fontSize: 28 }}
            aria-label="Add"
          >
            <ArchiveRestore />
          </button>
        </form>
      </main>
    </RequireAuth>
  );
}
