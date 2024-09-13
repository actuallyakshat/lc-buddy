import { currentUser } from "@clerk/nextjs/server";
import Sidebar from "./_components/Sidebar";
import prisma from "@/db";
import LinkLeetcodeAccount from "./_components/LinkLeetcodeAccount";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const userDetails = await prisma.user.findUnique({
    where: { id: user?.id },
  });

  return (
    <div>
      <Sidebar />
      {userDetails?.leetcodeId && (
        <main className="w-full pl-80 pt-16">{children}</main>
      )}
      {!userDetails?.leetcodeId && <LinkLeetcodeAccount userId={user!.id} />}
    </div>
  );
}
