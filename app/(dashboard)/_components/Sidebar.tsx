import Link from "next/link";

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard/",
  },
  {
    name: "All Buddies",
    href: "/buddies",
  },
  {
    name: "Invites",
    href: "/invites",
  },
  {
    name: "Profile",
    href: "/profile",
  },
];

export default function Sidebar() {
  return (
    <aside className="thin-scrollbar fixed left-0 z-[10] h-screen w-80 overflow-y-auto border-r bg-white pt-16">
      <div>
        {SIDEBAR_ITEMS.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-4 rounded-md px-4 py-2 text-sm font-medium hover:bg-muted/10"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </aside>
  );
}
