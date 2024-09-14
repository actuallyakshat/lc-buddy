import prisma from "@/db";
import Link from "next/link";
import React from "react";

export default async function Members({
  params,
}: {
  params: { groupId: string };
}) {
  const allMembersOfGroup = await prisma.membership.findMany({
    where: { groupId: params.groupId },
    include: { user: true, group: true },
  });

  return (
    <div className="px-16 pt-12">
      <div className="flex w-full items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Members of {allMembersOfGroup[0].group.name}
          </h2>
          <p className="text-sm font-medium text-muted-foreground">
            List of all the members of this group
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href={`/group/${params.groupId}/`}
          >
            Go back
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {allMembersOfGroup.map((membership) => (
          <div key={membership.user.id} className="flex items-center gap-3">
            <h4 className="text-xl font-bold">{membership.user.name}</h4>
            <p className="text-sm">({membership.user.leetcodeId})</p>
          </div>
        ))}
      </div>
    </div>
  );
}
