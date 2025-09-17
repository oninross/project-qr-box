/* eslint-disable @next/next/no-sync-scripts */
import { Toaster } from "sonner";

import GlobalNav from "@/components/GlobalNav";
import SessionTimeoutClient from "@/components/SessionTimeoutClient";

import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bodega – Your virtual storeroom",
  description:
    "A Smart AR storage web app. Scan, search, and see what’s inside your boxes instantly with a virtual locker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://aframe.io/releases/1.4.2/aframe.min.js"></script>
        <script src="https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/aframe/build/aframe-ar.js"></script>

        {/* <script src="https://aframe.io/releases/0.8.0/aframe.min.js"></script>
        <script src="https://cdn.rawgit.com/jeromeetienne/AR.js/1.6.0/aframe/build/aframe-ar.js"></script> */}
      </head>

      <body className="arjs antialiased">
        <SessionTimeoutClient />

        {children}

        <GlobalNav />

        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
