import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import prisma from "@/db";
import { GroupWithMembershipsAndUsers } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";
import { MemberRole } from "@prisma/client";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import ChooseImageDialog from "./_components/ChooseImageDialog";
import DeleteGroupButton from "./_components/DeleteGroupButton";
import EditGroupButton from "./_components/EditGroupButton";
import AddFriendModal from "./_components/page";

export default async function GroupPage({
  params,
}: {
  params: { groupId: string };
}) {
  const user = await currentUser();
  const id = params.groupId as string;
  const groupDetails = await prisma.group.findUnique({
    where: { id },
    include: {
      memberships: {
        include: { user: true },
      },
    },
  });

  const userInMembership = groupDetails?.memberships.find(
    (membership) => membership.user.id === user?.id,
  );

  if (!userInMembership) return <div>You are not a member of this group</div>;

  if (!groupDetails) return <div>Group not found</div>;

  return (
    <div>
      <div
        className={`group relative min-h-[300px] w-full ${
          groupDetails?.headerImageURL ? "group-header-image" : "bg-zinc-200"
        }`}
        style={
          groupDetails?.headerImageURL
            ? { backgroundImage: `url('${groupDetails.headerImageURL}')` }
            : {}
        }
      >
        <ChooseImageDialog groupId={id} />
      </div>
      <div className="px-16 pt-12">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">{groupDetails?.name}</h2>
            <p className="text-sm font-medium text-muted-foreground">
              {groupDetails?.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <OptionsMenu
              id={id}
              groupDetails={groupDetails}
              role={userInMembership.role}
            />
          </div>
        </div>
        {groupDetails?.memberships.map((membership) => (
          <div key={membership.user.id}>{membership.user.name}</div>
        ))}
      </div>
    </div>
  );
}

function OptionsMenu({
  id,
  role,
  groupDetails,
}: {
  id: string;
  role: MemberRole;
  groupDetails: GroupWithMembershipsAndUsers;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-10 text-left hover:bg-none">
        <DropdownMenuLabel>Group Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={`/group/${id}/members`} className="w-full">
            View Members
          </Link>
        </DropdownMenuItem>
        {role === MemberRole.ADMIN && (
          <div>
            <DropdownMenuItem asChild>
              <AddFriendModal groupId={id} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <EditGroupButton groupId={id} groupDetails={groupDetails} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DeleteGroupButton groupId={id} />
            </DropdownMenuItem>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
