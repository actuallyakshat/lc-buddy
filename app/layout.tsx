import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { GlobalProvider } from "@/context/GlobalContext";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import Navbar from "./(dashboard)/_components/Navbar";
import WakeUpScrapper from "@/components/WakeUpScrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LC Buddy",
  description:
    "An application that allows you to create and manage accountability buddies for LeetCode",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <GlobalProvider>
            <Navbar />
            <WakeUpScrapper />
            {children}
            <Toaster />
          </GlobalProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
