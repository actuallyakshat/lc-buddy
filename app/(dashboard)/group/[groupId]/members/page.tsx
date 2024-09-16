import prisma from "@/db";
import { MembershipWithUsers } from "@/types/types";
import { Ellipsis } from "lucide-react";
import Link from "next/link";

export default async function Members({
  params,
}: {
  params: { groupId: string };
}) {
  const allMembersOfGroup = await prisma.membership.findMany({
    where: { groupId: params.groupId },
    include: { user: true, group: true },
  });

  if (!allMembersOfGroup) return <div>Group not found</div>;

  return (
    <div className="px-16 pt-12">
      <div className="flex w-full items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Members of {allMembersOfGroup[0]?.group.name}
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
          <MemberCard key={membership.user.id} membership={membership} />
        ))}
      </div>
    </div>
  );
}

function MemberCard({ membership }: { membership: MembershipWithUsers }) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <Link
        href={"https://leetcode.com/u/" + membership.user.leetcodeId}
        target="_blank"
        key={membership.user.id}
        className="flex w-fit items-center gap-3"
      >
        <h4 className="text-xl font-bold">{membership.user.name}</h4>
        <p className="text-sm">({membership.user.leetcodeId})</p>
      </Link>
      <div>
        <MemberOptions membership={membership} />
      </div>
    </div>
  );
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function MemberOptions({ membership }: { membership: MembershipWithUsers }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-10 text-left hover:bg-none">
        <DropdownMenuLabel>Member Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Test Item</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
