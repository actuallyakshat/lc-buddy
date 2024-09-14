import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import { getAllInvites } from "../group/[groupId]/_actions/friends-actions";

export default async function Buddies() {
  const user = await currentUser();
  const data = await getAllInvites({ userId: user!.id });
  console.log(data);
  return (
    <div className="px-16 pt-12">
      <h2 className="text-3xl font-bold">All Friends</h2>
    </div>
  );
}
