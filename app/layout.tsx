import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./dashboard/_components/Navbar";
import { GlobalProvider } from "@/context/GlobalContext";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LC Buddy",
  description: "An application that allows you to create and manage accountability buddies for LeetCode",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <GlobalProvider>
        <html lang="en">
          <body className={`${inter.className}`}>
            <Navbar />
            {children}
          </body>
        </html>
      </GlobalProvider>
    </ClerkProvider>
  );
}
