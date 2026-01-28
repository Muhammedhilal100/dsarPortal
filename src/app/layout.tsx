import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DynamicFavicon from "@/components/DynamicFavicon";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConditionalNavbar from "@/components/ConditionalNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DSAR Portal | Privacy Compliance Platform",
  description: "Securely manage Data Subject Access Requests (DSAR) for your company with our automated platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <head>
        <link rel="icon" href={"/uploads/fav.png"} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased bg-white dark:bg-black text-zinc-900 dark:text-zinc-50`}
      >
        <DynamicFavicon logoUrl={"/uploads/fav.png"} />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
