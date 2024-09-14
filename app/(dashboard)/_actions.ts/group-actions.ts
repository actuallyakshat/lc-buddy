"use server";

import prisma from "@/db";
import { MemberRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createGroup({
  userId,
  name,
  description,
}: {
  userId: string;
  name: string;
  description?: string;
}) {
  try {
    // Create new group
    const group = await prisma.group.create({
      data: {
        name,
        description,
      },
    });

    //Add the creator as the first user.
    await prisma.membership.create({
      data: {
        userId: userId,
        groupId: group.id,
        role: MemberRole.ADMIN,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: group };
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return { success: false, error: err.message };
  }
}

export async function deleteGroup({ groupId }: { groupId: string }) {
  try {
    if (!groupId) throw new Error("Group ID is required");

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) throw new Error("Group not found");

    await prisma.group.delete({
      where: {
        id: groupId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: group };
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return { success: false, error: err.message };
  }
}
