import prisma from "@/db";
import {
  MembershipWithUsers,
  MembershipWithUsersAndGroup,
} from "@/types/types";
import Link from "next/link";

import { currentUser } from "@clerk/nextjs/server";
import { MemberRole } from "@prisma/client";
import MemberOptions from "./_components/MemberOptions";

export default async function Members({
  params,
}: {
  params: { groupId: string };
}) {
  const user = await currentUser();

  const allMembersOfGroup = await prisma.membership.findMany({
    where: { groupId: params.groupId },
    include: { user: true, group: true },
  });

  const userInMembership = allMembersOfGroup.find(
    (membership) => membership.user.id === user?.id,
  );

  if (!userInMembership) return <div>You are not a member of this group</div>;

  if (!allMembersOfGroup) return <div>Group not found</div>;

  return (
    <div className="page">
      <div className="flex w-full items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold lg:text-3xl">
            Members of {allMembersOfGroup[0]?.group.name}
          </h2>
          <p className="text-sm font-medium text-muted-foreground">
            List of all the members of this group
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className="whitespace-nowrap text-sm font-medium underline-offset-4 hover:underline"
            href={`/group/${params.groupId}/`}
          >
            Go back
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {allMembersOfGroup
          .filter((u) => u.role === MemberRole.ADMIN)
          .map((membership) => (
            <MemberCard
              key={membership.user.id}
              userId={user!.id}
              membership={membership}
              currentUserRole={userInMembership.role}
            />
          ))}
        {allMembersOfGroup
          .filter((u) => u.role === MemberRole.MEMBER)
          .map((membership) => (
            <MemberCard
              key={membership.user.id}
              userId={user!.id}
              membership={membership}
              currentUserRole={userInMembership.role}
            />
          ))}
      </div>
    </div>
  );
}

function MemberCard({
  userId,
  membership,
  currentUserRole,
}: {
  userId: string;
  membership: MembershipWithUsersAndGroup;
  currentUserRole: MemberRole;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <Link
        href={"https://leetcode.com/u/" + membership.user.leetcodeId}
        target="_blank"
        key={membership.user.id}
        className="flex w-fit items-center gap-3"
      >
        <h4 className="md:text-lg"> ~ {membership.user.name}</h4>
        <p className="hidden text-sm md:block">
          ({membership.user.leetcodeId})
        </p>
        {membership.role == MemberRole.ADMIN && (
          <p className="rounded-full bg-gradient-to-r from-yellow-600 to-orange-600 px-4 py-1 text-[0.6rem] font-medium text-white">
            Admin
          </p>
        )}
      </Link>
      {membership.group.creatorId != membership.userId &&
        currentUserRole === MemberRole.ADMIN &&
        membership.userId != userId && (
          <div>
            <MemberOptions
              userId={userId}
              membership={membership}
              currentUserRole={currentUserRole}
            />
          </div>
        )}
    </div>
  );
}
