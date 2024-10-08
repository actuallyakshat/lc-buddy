import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NavbarMobile from "./NavbarMobile";

export default function Navbar() {
  return (
    <nav className="fixed z-[11] h-16 w-full border-b bg-background">
      <div className="relative mx-auto flex h-full w-full max-w-screen-lg items-center justify-between px-5 2xl:max-w-screen-xl">
        <Link
          href={"/"}
          className="flex items-center gap-3 text-lg font-extrabold"
        >
          <Image
            src="/logo.png"
            alt="LeetCode Buddy Logo"
            width={100}
            height={100}
            className="max-w-8"
          />
          <h2 className="font-medium">LC Buddy</h2>
        </Link>
        <div className="hidden items-center gap-4 text-sm font-medium lg:flex">
          <SignedIn>
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
            <Link
              href={"/sign-in"}
              className="underline-offset-4 hover:underline"
            >
              Login
            </Link>
            <Link
              href={"/sign-up"}
              className="underline-offset-4 hover:underline"
            >
              Register
            </Link>
          </SignedOut>
        </div>
        <NavbarMobile />
      </div>
    </nav>
  );
}
