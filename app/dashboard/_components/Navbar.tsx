import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed w-full h-16 border-b z-[11] bg-background">
      <div className="max-w-screen-xl mx-auto h-full w-full flex items-center justify-between">
        <Link
          href={"/"}
          className="font-extrabold text-lg">
          LC Buddy
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <SignedIn>
            <Link href="/dashboard">Dashboard</Link>
            <SignOutButton>Sign out</SignOutButton>
          </SignedIn>
          <SignedOut>
            <SignInButton>Sign In</SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
