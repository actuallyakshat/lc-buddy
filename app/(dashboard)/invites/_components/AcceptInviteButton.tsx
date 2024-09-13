"use client";
import React from "react";
import { acceptInvite } from "../../group/[groupId]/_actions/friends-actions";

export default function AcceptInviteButton({
  inviteId,
  userId,
}: {
  inviteId: string;
  userId: string;
}) {
  return (
    <button
      onClick={() => acceptInvite({ inviteId: inviteId, receiverId: userId })}
    >
      Accept
    </button>
  );
}
