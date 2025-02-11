import { Invite } from "@prisma/client";
import React from "react";
import AcceptInviteButton from "./AcceptInviteButton";
import { InviteWithGroupAndUser } from "@/types/types";
import InviteCard from "./InviteCard";

export default function IncomingInvites({
  invites,
  userId,
}: {
  invites: InviteWithGroupAndUser[];
  userId: string;
}) {
  return (
    <div className="mt-5 min-h-[30vh] space-y-2">
      {invites!
        .filter((invite) => invite.receiverId == userId)
        .map((invite) => (
          <InviteCard
            key={invite.id}
            invite={invite}
            type="incoming"
            userId={userId}
          />
        ))}
      {invites!.length == 0 && (
        <p className="mt-5 text-sm font-medium text-muted-foreground">
          You have no incoming invites {":("}
        </p>
      )}
    </div>
  );
}
