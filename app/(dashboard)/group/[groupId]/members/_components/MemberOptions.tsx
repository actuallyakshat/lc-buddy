"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MembershipWithUsers,
  MembershipWithUsersAndGroup,
} from "@/types/types";
import { MemberRole } from "@prisma/client";
import { Ellipsis } from "lucide-react";
import { toast } from "sonner";
import {
  makeAdmin,
  removeAsAdmin,
  removeMember,
} from "../_actions/admin-actions";
import { useState } from "react";

export default function MemberOptions({
  userId,
  membership,
  currentUserRole,
}: {
  userId: string;
  membership: MembershipWithUsersAndGroup;
  currentUserRole: MemberRole;
}) {
  const [loading, setLoading] = useState(false);

  async function handleRemoveUser() {
    setLoading(true);
    toast.loading("Removing user...", { id: "remove-user" });
    try {
      const response = await removeMember({
        groupId: membership.groupId,
        userId: membership.user.id,
      });
      if (response.success) {
        toast.success("User removed", { id: "remove-user" });
        setLoading(false);
      } else {
        toast.error("Error removing user", { id: "remove-user" });
        setLoading(false);
      }
    } catch (error) {
      toast.error("Error removing user", { id: "remove-user" });
      console.error(error);
    }
  }

  async function handleMakeUserAdmin() {
    setLoading(true);
    toast.loading("Making user admin...", { id: "make-user-admin" });
    try {
      const response = await makeAdmin({
        groupId: membership.groupId,
        userId: membership.user.id,
      });
      if (response.success) {
        toast.success("User made admin", { id: "make-user-admin" });
        setLoading(false);
      } else {
        toast.error("Error making user admin", { id: "make-user-admin" });
        setLoading(false);
      }
    } catch (error) {
      toast.error("Error making user admin", { id: "make-user-admin" });
      console.error(error);
    }
  }

  async function handleRemoveAsAdmin() {
    setLoading(true);
    toast.loading("Removing user as admin...", { id: "remove-user" });
    try {
      const response = await removeAsAdmin({
        groupId: membership.groupId,
        userId: membership.user.id,
      });
      if (response.success) {
        toast.success("User removed as admin", { id: "remove-user" });
        setLoading(false);
      } else {
        toast.error("Error removing user as admin", { id: "remove-user" });
        setLoading(false);
      }
    } catch (error) {
      toast.error("Error removing user as admin", { id: "remove-user" });
      console.error(error);
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-10 text-left hover:bg-none">
        <DropdownMenuLabel>Member Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {membership.role == MemberRole.MEMBER && (
          <DropdownMenuItem
            onClick={handleMakeUserAdmin}
            disabled={loading}
            className="cursor-pointer"
          >
            Make Admin
          </DropdownMenuItem>
        )}
        {membership.group.creatorId == userId &&
          membership.role == MemberRole.ADMIN && (
            <DropdownMenuItem
              onClick={handleRemoveAsAdmin}
              disabled={loading}
              className="cursor-pointer"
            >
              Remove as Admin
            </DropdownMenuItem>
          )}
        <DropdownMenuItem
          onClick={handleRemoveUser}
          disabled={loading}
          className="cursor-pointer"
        >
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
