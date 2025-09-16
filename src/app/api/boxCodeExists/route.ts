import { collection, query, where, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

import { db } from "@/lib/firebase";

export async function POST(req: Request) {
  try {
    const { boxCode } = await req.json();
    if (!boxCode) return NextResponse.json({ exists: false });
    const q = query(collection(db, "boxes"), where("boxCode", "==", boxCode));
    const snap = await getDocs(q);
    return NextResponse.json({ exists: !snap.empty });
  } catch (err) {
    console.error("boxCodeExists API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
