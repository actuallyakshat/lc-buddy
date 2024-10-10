import React from "react";
import AddGroup from "./AddGroup";
import { MembershipWithGroups } from "@/types/types";
import { Group } from "@prisma/client";
import Link from "next/link";

export default function GroupsGrid({
  userGroups,
}: {
  userGroups: MembershipWithGroups[];
}) {
  return (
    <div>
      <h1 className="text-3xl font-extrabold">Groups</h1>
      <p className="pr-10 text-sm md:text-base">
        Accountability groups where you can compete with your friends and peers.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        <AddGroup />
        {userGroups.map((membership) => (
          <GroupCard key={membership.group.id} group={membership.group} />
        ))}
      </div>
    </div>
  );
}

function GroupCard({ group }: { group: Group }) {
  const groupHeaderImage = group.headerImageURL
    ? `url('${group.headerImageURL}')`
    : "";
  return (
    <Link
      href={`/group/${group.id}`}
      className="flex min-h-[200px] flex-col overflow-hidden rounded-xl border"
    >
      <div
        className="h-[140px] bg-zinc-200"
        style={{
          backgroundImage: groupHeaderImage,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="p-4">
        <h3 className="text-lg font-medium">{group.name}</h3>
        <p className="text-sm">{group.description}</p>
      </div>
    </Link>
  );
}
