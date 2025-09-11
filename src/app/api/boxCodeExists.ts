import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { boxCode } = await req.json();
  if (!boxCode) return NextResponse.json({ exists: false });
  const q = query(collection(db, "boxes"), where("boxCode", "==", boxCode));
  const snap = await getDocs(q);
  return NextResponse.json({ exists: !snap.empty });
}
