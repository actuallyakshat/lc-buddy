import prisma from "@/db";
import React from "react";
import AddFriendModal from "./_components/page";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Camera, Ellipsis } from "lucide-react";
import DeleteGroupButton from "./_components/DeleteGroupButton";
import ChooseImageDialog from "./_components/ChooseImageDialog";

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
            <OptionsMenu id={id} />
          </div>
        </div>
        {groupDetails?.memberships.map((membership) => (
          <div key={membership.user.id}>{membership.user.name}</div>
        ))}
      </div>
    </div>
  );
}

function OptionsMenu({ id }: { id: string }) {
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
        <DropdownMenuItem asChild>
          <AddFriendModal groupId={id} />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DeleteGroupButton groupId={id} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
