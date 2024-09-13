import Link from "next/link";

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard/",
  },
  {
    name: "All Buddies",
    href: "/dashboard/buddies",
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 w-80 h-screen border-r pt-16 overflow-y-auto thin-scrollbar z-[10] bg-white">
      <div>
        {SIDEBAR_ITEMS.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-4 px-4 py-2 text-sm font-medium hover:bg-muted/10 rounded-md">
            {item.name}
          </Link>
        ))}
      </div>
    </aside>
  );
}
