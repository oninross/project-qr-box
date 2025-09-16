import type { Metadata } from "next";
import "./globals.css";
import GlobalNav from "@/components/GlobalNav";

import SessionTimeoutClient from "@/components/SessionTimeoutClient";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "QR Box",
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
      <body className={`antialiased`}>
        <SessionTimeoutClient />
        {children}
        <GlobalNav />

        <Toaster richColors position="bottom-left" />
      </body>
    </html>
  );
}
