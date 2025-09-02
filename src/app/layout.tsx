// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UserBadge from "@/components/UserBadge";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MIS Job Board",
  description: "MIS Student Job Board",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Add base background + text color so all routes inherit a consistent look */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-emerald-50 text-emerald-950`}>
        {/* Global header with role-aware nav (Home / Post / Approvals / Jobs) */}
        <UserBadge />

        {/* Main content for each route */}
        <main>{children}</main>
      </body>
    </html>
  );
}
