"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation"; // <-- FIXED
import { useState } from "react";

export default function BoxSearch({ hasBox, initialValue = '' }: { hasBox: boolean, initialValue?: string }) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
  };

  if (!hasBox) return null;

  return (
    <form className="flex items-center w-full mx-auto my-4" onSubmit={handleSearch}>
      <input
        type="text"
        className="h-12 bg-white flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        type="submit"
        className="h-12 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r flex items-center"
        aria-label="Search"
      >
        <Search size={20} />
      </button>
    </form>
  );
}