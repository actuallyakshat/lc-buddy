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
import AddFriendModal from "./_components/AddFriendModal";
import { getLeetcodeUserData } from "./_actions/leetcode-actions";
import { getSolvedQuestionsThisWeek } from "@/lib/utils";
import { WeeklySubmissionsChart } from "./_components/WeeklySubmissionsChart";
import { SubmissionsConrtibutionPieChart } from "./_components/SubmissionsConrtibutionPieChart";
import { DifficultyBifurcationBarChart } from "./_components/DifficultyBifurcationBarChart";

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

  const usersLeetcodeId = groupDetails.memberships.map((membership) => ({
    id: membership.user.leetcodeId,
    name: membership.user.name,
  }));

  // Fetch LeetCode user data with a fallback to avoid breaking the page
  // let usersLeetcodeData = [];
  // try {
  //   usersLeetcodeData = await getLeetcodeUserData(usersLeetcodeId);
  // } catch (error) {
  //   console.error("Error fetching LeetCode data:", error);
  // }
  let usersLeetcodeData = [];
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/leetcodeData`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leetcodeIdAndName: usersLeetcodeId }),
      },
    );

    if (response.ok) {
      usersLeetcodeData = await response.json();
    } else {
      console.error("Error fetching LeetCode data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching LeetCode data:", error);
  }

  const solvedThisWeek = usersLeetcodeData.map((data: any) =>
    getSolvedQuestionsThisWeek(data?.submissionCalendar ?? {}, data.name),
  );

  return (
    <div className="pb-12">
      <div
        className={`group relative min-h-[300px] w-full ${
          groupDetails?.headerImageURL ? "group-header-image" : ""
        } bg-zinc-300`}
        style={
          groupDetails?.headerImageURL
            ? { backgroundImage: `url('${groupDetails.headerImageURL}')` }
            : {}
        }
      >
        <ChooseImageDialog groupId={id} userRole={userInMembership.role} />
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
              id={id}
              groupDetails={groupDetails}
              role={userInMembership.role}
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
  groupDetails: GroupWithMembershipsAndUsers;
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
