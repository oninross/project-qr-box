import { getApps, initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

if (!getApps().length) {
  initializeApp({
    credential: process.env.FIREBASE_PRIVATE_KEY
      ? cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        })
      : applicationDefault(),
  });
}

const adminDb = getFirestore();

export async function POST(req: Request) {
  try {
    const { boxCode } = await req.json();
    if (!boxCode) return NextResponse.json({ exists: false });

    const snap = await adminDb.collection("boxes").where("boxCode", "==", boxCode).get();
    return NextResponse.json({ exists: !snap.empty });
  } catch (err) {
    console.error("boxCodeExists API error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
