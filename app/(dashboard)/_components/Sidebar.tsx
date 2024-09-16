import { Code, Handshake, MailPlus, Terminal, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

export default function Sidebar() {
  return (
    <aside className="thin-scrollbar fixed left-0 z-[10] h-screen w-80 overflow-y-auto border-r bg-background pt-16">
      <div className="flex h-full flex-col justify-between gap-4 py-6">
        <div>
          <Link
            href={"/"}
            className="mx-auto mb-6 flex w-full items-center gap-3 px-6 text-lg font-extrabold"
          >
            <Image
              src="/logo.png"
              alt="LeetCode Buddy Logo"
              width={100}
              height={100}
              className="max-w-8"
            />
            <h2 className="text-base font-medium">LeetCode Buddy</h2>
          </Link>

          {SIDEBAR_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-4 rounded-md px-6 py-3 transition-colors hover:bg-muted"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
        <Link
          href="/profile"
          className="flex items-center gap-4 rounded-md px-6 py-2 hover:bg-muted"
        >
          <User className="size-5" />
          Profile
        </Link>
      </div>
    </aside>
  );
}
