import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed z-[11] h-16 w-full border-b bg-background">
      <div className="mx-auto flex h-full w-full max-w-screen-xl items-center justify-between">
        <Link href={"/"} className="text-lg font-extrabold">
          <Image
            src="/logo.png"
            alt="LeetCode Buddy Logo"
            width={100}
            height={100}
            className="max-w-8"
          />
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <SignedIn>
            <button className="relative mr-1.5 h-fit">
              <Bell className="size-5" />
              <span className="absolute -right-1 -top-2 size-3 animate-pulse rounded-full bg-red-600"></span>
            </button>
            <Link
              href="/dashboard"
              className="underline-offset-4 hover:underline"
            >
              Dashboard
            </Link>
            <SignOutButton>
              <span className="cursor-pointer underline-offset-4 hover:underline">
                Sign Out
              </span>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <span className="cursor-pointer underline-offset-4 hover:underline">
                Sign In
              </span>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
