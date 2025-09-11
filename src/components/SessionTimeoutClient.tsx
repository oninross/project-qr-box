"use client";
import dynamic from "next/dynamic";
const SessionTimeout = dynamic(() => import("@/components/SessionTimeout"), { ssr: false });

export default function SessionTimeoutClient() {
  return <SessionTimeout />;
}
