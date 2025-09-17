"use client";

import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "sonner";

import BoxSearch from "@/components/BoxSearch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserAvatar from "@/components/UserAvatar";
import { auth, db } from "@/lib/firebase";

type Item = {
  id: string;
  name: string;
  boxId: string;
  image?: string;
  [key: string]: unknown;
};

type Box = {
  id: string;
  name?: string;
  boxCode?: string;
  [key: string]: unknown;
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("query")?.trim() || "";
  const [user, loadingUser] = useAuthState(auth); // <-- use the hook
  const [results, setResults] = useState<Item[]>([]);
  const [boxesMap, setBoxesMap] = useState<Record<string, Box>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loadingUser || !user || !searchTerm) return; // <-- wait for user to load

    const fetchResults = async () => {
      setLoading(true);

      // Get all boxes for the current user
      const boxesSnap = await getDocs(
        query(collection(db, "boxes"), where("userId", "==", user.uid))
      );
      const boxesArr: Box[] = boxesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const boxIds = boxesArr.map((box) => box.id);
      // Map for quick lookup
      const boxesById: Record<string, Box> = {};
      boxesArr.forEach((box) => {
        boxesById[box.id] = box;
      });
      setBoxesMap(boxesById);

      if (boxIds.length === 0) {
        setResults([]);
        setLoading(false);
        return;
      }

      // Search for relevant items in all user's boxes
      const itemsSnap = await getDocs(query(collection(db, "items"), where("boxId", "in", boxIds)));

      // Filter items by name relevance (case-insensitive substring match)
      const foundItems: Item[] = itemsSnap.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name as string,
            boxId: data.boxId as string,
            image: data.image as string,
            ...data,
          };
        })
        .filter((item) => item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()));

      setResults(foundItems);
      setLoading(false);

      if (foundItems.length === 0) {
        toast.error(`${searchTerm} is not found in any of your boxes`);
      }
    };

    fetchResults();
  }, [user, searchTerm, loadingUser]); // <-- include loadingUser

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex space-between w-full">
        <h1 className="text-4xl mr-auto font-bold">Search Results for &quot;{searchTerm}&quot;</h1>
        <UserAvatar size={48} />
      </div>

      <BoxSearch hasBox initialValue={searchTerm} />

      {loading && <div>Searching...</div>}

      {!loading && results.length > 0 && (
        <ul>
          {results.map((item) => {
            const box = boxesMap[item.boxId];
            return (
              <Card
                key={item.id}
                className="flex flex-row mb-4 items-center gap-4 p-4 cursor-pointer rounded-sm hover:shadow-lg transition w-full"
                onClick={() =>
                  box ? router.push(`/find-item?boxId=${box.id}&itemId=${item.id}`) : undefined
                }
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded"
                    style={{ objectFit: "cover", borderRadius: "0.375rem" }}
                    unoptimized={false}
                  />
                )}

                <CardContent>
                  <p className="font-semibold">{item.name}</p>

                  {box && (
                    <p className="text-xs text-gray-500">
                      In box: <span className="font-medium">{box.name}</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </ul>
      )}
      {!loading && results.length === 0 && <div className="text-gray-500">No items found.</div>}
    </main>
  );
}
