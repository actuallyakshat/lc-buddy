"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SignOutButton } from "@clerk/nextjs";
import {
  Handshake,
  LogOut,
  MailPlus,
  Menu,
  Terminal,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard/",
    icon: <Terminal className="size-5 stroke-[2px]" />,
  },
  {
    name: "All Friends",
    href: "/friends",
    icon: <Handshake className="size-5" />,
  },
  {
    name: "Invites",
    href: "/invites",
    icon: <MailPlus className="size-5" />,
  },
];

export default function NavbarMobile() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="lg:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side={"right"} className="w-full max-w-full">
        <SheetHeader>
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
        </SheetHeader>
        <div className="flex h-full flex-col justify-between gap-4 py-6">
          <div>
            {SIDEBAR_ITEMS.map((item) => (
              <Link
                key={item.name}
                onClick={() => setOpen(false)}
                href={item.href}
                className="flex items-center gap-4 rounded-md py-3 transition-colors active:bg-muted"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>

          <div className="mb-2">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 rounded-md py-3 active:bg-muted"
            >
              <User className="size-5" />
              Profile
            </Link>
            <SignOutButton>
              <button className="flex cursor-pointer items-center gap-4 py-3 underline-offset-4 hover:underline">
                <span>
                  <LogOut className="size-5" />
                </span>
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
