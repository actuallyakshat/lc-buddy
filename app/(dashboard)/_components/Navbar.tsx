import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { Bell } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed z-[11] h-16 w-full border-b bg-background">
      <div className="mx-auto flex h-full w-full max-w-screen-xl items-center justify-between">
        <Link href={"/"} className="text-lg font-extrabold">
          LC Buddy
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <SignedIn>
            <div className="relative h-fit">
              <Bell className="size-5" />
              <span className="absolute -right-1 -top-2 size-3 rounded-full bg-red-600"></span>
            </div>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <SignOutButton>
              <span className="cursor-pointer hover:underline">Sign Out</span>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <span className="cursor-pointer hover:underline">Sign In</span>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
