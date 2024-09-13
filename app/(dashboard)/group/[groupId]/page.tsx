import prisma from "@/db";
import React from "react";
import AddFriendModal from "./_components/page";

export default async function GroupPage({
  params,
}: {
  params: { groupId: string };
}) {
  const id = params.groupId as string;
  const groupDetails = await prisma.group.findUnique({
    where: { id },
    include: {
      memberships: {
        include: { user: true },
      },
    },
  });
  return (
    <div>
      Group Page: {groupDetails?.name}
      <AddFriendModal groupId={id} />
      {groupDetails?.memberships.map((membership) => (
        <div key={membership.user.id}>{membership.user.name}</div>
      ))}
    </div>
  );
}
