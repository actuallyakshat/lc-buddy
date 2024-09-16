"use server";

import prisma from "@/db";
import { MemberRole } from "@prisma/client";
import { error } from "console";
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
        creatorId: userId,
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

export async function searchHeaderImage({
  searchQuery,
}: {
  searchQuery: string;
}) {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=15`,
      {
        headers: {
          Authorization: `${process.env.PEXEL_API_KEY}`,
        },
      },
    );
    const data = await response.json();
    return { success: true, data: data, error: "" };
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return { success: false, error: err.message, data: [] };
  }
}

export async function updateGroupHeaderImage({
  groupId,
  imageUrl,
}: {
  groupId: string;
  imageUrl: string;
}) {
  try {
    if (!groupId) throw new Error("Group ID is required");
    if (!imageUrl) throw new Error("Image URL is required");

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) throw new Error("Group not found");

    await prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        headerImageURL: imageUrl,
      },
    });

    revalidatePath("/group/" + groupId);
    return { success: true, data: group };
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return { success: false, error: err.message };
  }
}

export async function editGroup({
  groupId,
  name,
  description,
}: {
  groupId: string;
  name: string;
  description?: string;
}) {
  try {
    if (!groupId) throw new Error("Group ID is required");
    if (!name) throw new Error("Name is required");

    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    if (!group) throw new Error("Group not found");

    await prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        name,
        description,
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
