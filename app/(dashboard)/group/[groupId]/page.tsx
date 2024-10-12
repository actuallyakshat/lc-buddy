import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import prisma from "@/db";
import { getSolvedQuestionsThisWeek } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { MemberRole } from "@prisma/client";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import AddFriendModal from "./_components/AddFriendModal";
import ChooseImageDialog from "./_components/ChooseImageDialog";
import DeleteGroupButton from "./_components/DeleteGroupButton";
import { DifficultyBifurcationBarChart } from "./_components/DifficultyBifurcationBarChart";
import EditGroupButton from "./_components/EditGroupButton";
import { SubmissionsConrtibutionPieChart } from "./_components/SubmissionsConrtibutionPieChart";
import { WeeklySubmissionsChart } from "./_components/WeeklySubmissionsChart";
import { getLeetcodeUserData } from "./_actions/leetcode-actions";

export default async function GroupPage({
  params,
}: {
  params: { groupId: string };
}) {
  const user = await currentUser();
  const groupId = params.groupId;

  const groupDetails = await prisma.group.findUnique({
    where: { id: groupId },
    include: { memberships: { include: { user: true } } },
  });

  if (!groupDetails) return <div>Group not found</div>;

  const userInMembership = groupDetails.memberships.find(
    (membership) => membership.user.id === user?.id,
  );
  if (!userInMembership) return <div>You are not a member of this group</div>;

  const usersLeetcodeId = groupDetails.memberships.map((membership) => ({
    id: membership.user.leetcodeId,
    name: membership.user.name,
  }));

  // Fetch LeetCode user data with retry logic
  let usersLeetcodeData = [];
  try {
    const response = await getLeetcodeUserData(usersLeetcodeId);
    if (response) usersLeetcodeData = response;
    else throw new Error("Failed to fetch LeetCode data");
  } catch (error) {
    console.error("Error fetching LeetCode data:", error);
  }

  const solvedThisWeek = usersLeetcodeData.map((data: any) =>
    getSolvedQuestionsThisWeek(data?.submissionCalendar ?? {}, data.name),
  );

  return (
    <div className="pb-12">
      <div
        className={`group relative min-h-[300px] w-full ${groupDetails?.headerImageURL ? "group-header-image" : ""} bg-zinc-300`}
        style={
          groupDetails?.headerImageURL
            ? { backgroundImage: `url('${groupDetails.headerImageURL}')` }
            : {}
        }
      >
        <ChooseImageDialog groupId={groupId} userRole={userInMembership.role} />
      </div>
      <div className="page">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              {groupDetails?.name}
            </h2>
            <p className="text-sm font-medium text-muted-foreground">
              {groupDetails?.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <OptionsMenu
              id={groupId}
              role={userInMembership.role}
              groupDetails={groupDetails}
            />
          </div>
        </div>
        {solvedThisWeek.length > 0 && (
          <WeeklySubmissionsChart data={solvedThisWeek} />
        )}
        <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
          <DifficultyBifurcationBarChart data={usersLeetcodeData} />
          <SubmissionsConrtibutionPieChart data={solvedThisWeek} />
        </div>
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
  groupDetails: any;
}) {
  return (
    <DropdownMenu modal={false}>
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
        {role === "ADMIN" && (
          <>
            <DropdownMenuItem asChild>
              <AddFriendModal groupId={id} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <EditGroupButton groupId={id} groupDetails={groupDetails} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DeleteGroupButton groupId={id} />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
