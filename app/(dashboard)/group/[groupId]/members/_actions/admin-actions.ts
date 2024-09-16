"use server";

import prisma from "@/db";
import { MemberRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function makeAdmin({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) {
  try {
    if (!groupId) throw new Error("Group ID is required");
    if (!userId) throw new Error("User ID is required");

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) throw new Error("Group not found");

    await prisma.membership.update({
      where: {
        userId_groupId: {
          userId: userId,
          groupId: groupId,
        },
      },
      data: {
        role: "ADMIN",
      },
    });

    revalidatePath("/group" + groupId);
    return { success: true, data: group };
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return { success: false, error: err.message };
  }
}

export async function removeMember({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) {
  try {
    if (!groupId) throw new Error("Group ID is required");
    if (!userId) throw new Error("User ID is required");

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) throw new Error("Group not found");

    await prisma.membership.delete({
      where: {
        userId_groupId: {
          userId: userId,
          groupId: groupId,
        },
      },
    });

    revalidatePath("/group" + groupId);
    return { success: true, data: group };
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return { success: false, error: err.message };
  }
}

export async function removeAsAdmin({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}) {
  try {
    if (!groupId) throw new Error("Group ID is required");
    if (!userId) throw new Error("User ID is required");

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) throw new Error("Group not found");

    await prisma.membership.update({
      where: {
        userId_groupId: {
          userId: userId,
          groupId: groupId,
        },
      },
      data: {
        role: MemberRole.MEMBER,
      },
    });

    revalidatePath("/group" + groupId);
    return { success: true, data: group };
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return { success: false, error: err.message };
  }
}
