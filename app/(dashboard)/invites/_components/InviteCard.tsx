"use client";
import { InviteWithGroupAndUser } from "@/types/types";
import { Check, Plus } from "lucide-react";
import React from "react";
import {
  acceptInvite,
  cancelInvite,
} from "../../group/[groupId]/_actions/friends-actions";
import { toast } from "sonner";

export default function InviteCard({
  invite,
  type,
  userId,
}: {
  invite: InviteWithGroupAndUser;
  type: "incoming" | "outgoing";
  userId: string;
}) {
  async function handleAcceptInvite() {
    {
      toast.loading("Accepting invite", { id: "accept-invite" });
      const response = await acceptInvite({
        inviteId: invite.id,
        receiverId: userId,
      });
      if (response.success) {
        toast.success("Invite accepted successfully", {
          id: "accept-invite",
        });
      } else {
        toast.error(response.error, { id: "accept-invite" });
      }
    }
  }

  async function handleRejectInvite() {
    {
      toast.loading("Rejecting invite", { id: "reject-invite" });
      const response = await cancelInvite({
        inviteId: invite.id,
      });
      if (response.success) {
        toast.success("Invite rejected successfully", {
          id: "reject-invite",
        });
      } else {
        toast.error(response.error, { id: "reject-invite" });
      }
    }
  }

  async function handleCancelInvite() {
    {
      toast.loading("Cancelling invite", { id: "cancel-invite" });
      const response = await cancelInvite({
        inviteId: invite.id,
      });
      if (response.success) {
        toast.success("Invite cancelled successfully", {
          id: "cancel-invite",
        });
      } else {
        toast.error(response.error, { id: "cancel-invite" });
      }
    }
  }

  return (
    <div className="flex w-full max-w-xl items-center justify-between rounded-md border p-4 shadow-sm">
      <div>
        <h2 className="text-xl font-bold">{invite.group.name}</h2>
        <p className="text-sm font-medium text-muted-foreground">
          Invited by {invite.sender.name}
        </p>
      </div>
      {type == "incoming" && (
        <div className="flex items-center gap-2">
          <button onClick={handleAcceptInvite}>
            <Check />
          </button>
          <button onClick={handleRejectInvite}>
            <Plus className="size-6 rotate-45" />
          </button>
        </div>
      )}
      {type == "outgoing" && (
        <button className="text-sm font-medium" onClick={handleCancelInvite}>
          Cancel
        </button>
      )}
    </div>
  );
}
