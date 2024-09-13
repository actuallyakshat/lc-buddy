import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./dashboard/_components/Navbar";

export const inter = Inter({ subsets: ["latin"] });

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
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
