import Sidebar from "./_components/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Sidebar />
      <main className="w-full pl-80 pt-16">{children}</main>
    </div>
  );
}
