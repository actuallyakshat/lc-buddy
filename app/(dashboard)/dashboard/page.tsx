import prisma from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import GroupsGrid from "../_components/GroupsGrid";

export default async function Dashboard() {
  const user = await currentUser();
  if (!user) redirect("/");

  const userGroups = await prisma.membership.findMany({
    where: { userId: user.id },
    include: { group: true },
  });

  return (
    <div className="page">
      <GroupsGrid userGroups={userGroups} />
    </div>
  );
}
