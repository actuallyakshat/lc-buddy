import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import {
  acceptInvite,
  getAllInvites,
} from "../group/[groupId]/_actions/friends-actions";
import AcceptInviteButton from "./_components/AcceptInviteButton";

export default async function Invites() {
  const user = await currentUser();
  const response = await getAllInvites({ userId: user!.id });
  if (!response.success) return <div>Error</div>;
  const allInvites = response.data;
  return (
    <div>
      <h1>Invites</h1>
      {allInvites!.map((invite) => (
        <div key={invite.id}>
          {invite.group.name} - {invite.sender.name}
          <AcceptInviteButton userId={user!.id} inviteId={invite.id} />
        </div>
      ))}
    </div>
  );
}
