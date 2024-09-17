"use server";

import prisma from "@/db";
import { revalidatePath } from "next/cache";

export async function sendInvite({
  groupId,
  senderId,
  receiverEmailId,
}: {
  groupId: string;
  senderId: string;
  receiverEmailId: string;
}) {
  try {
    const group = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        memberships: true,
      },
    });

    if (group?.memberships?.length && group?.memberships?.length >= 10)
      throw new Error("Sorry! We currently only allow 10 users per group.");

    if (!group) throw new Error("Group not found");

    const sender = await prisma.user.findUnique({
      where: {
        id: senderId,
      },
    });

    if (!sender) throw new Error("Sender not found");

    const receiver = await prisma.user.findUnique({
      where: {
        email: receiverEmailId,
      },
    });

    if (!receiver) throw new Error("Receiver not found");

    const alreadyAdded = await prisma.membership.findFirst({
      where: {
        userId: receiver.id,
        groupId,
      },
    });

    if (alreadyAdded) throw new Error("User already added to group");

    const invite = await prisma.invite.create({
      data: {
        groupId,
        senderId,
        receiverId: receiver.id,
      },
    });

    return { success: true, data: invite };
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return { success: false, error: err.message };
  }
}

export async function getAllInvites({ userId }: { userId: string }) {
  try {
    if (!userId) throw new Error("User ID is required");

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new Error("User not found");

    // Fetch both incoming and outgoing invites
    const invites = await prisma.invite.findMany({
      where: {
        OR: [
          { receiverId: userId }, // Incoming invites
          { senderId: userId }, // Outgoing invites
        ],
      },
      include: {
        group: true,
        sender: true,
      },
    });

    return { success: true, data: invites };
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return { success: false, error: err.message };
  }
}

export async function acceptInvite({
  inviteId,
  receiverId,
}: {
  inviteId: string;
  receiverId: string;
}) {
  try {
    if (!inviteId) throw new Error("Invite ID is required");
    if (!receiverId) throw new Error("Receiver ID is required");

    const invite = await prisma.invite.findUnique({
      where: {
        id: inviteId,
      },
      include: {
        group: true,
        sender: true,
      },
    });

    if (!invite) throw new Error("Invite not found");

    const membership = await prisma.membership.create({
      data: {
        userId: receiverId,
        groupId: invite.group.id,
        role: "MEMBER",
      },
    });

    await prisma.invite.delete({
      where: {
        id: inviteId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: membership };
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return { success: false, error: err.message };
  }
}

export async function cancelInvite({ inviteId }: { inviteId: string }) {
  try {
    if (!inviteId) throw new Error("Invite ID is required");

    const invite = await prisma.invite.findUnique({
      where: {
        id: inviteId,
      },
      include: {
        group: true,
        sender: true,
      },
    });

    if (!invite) throw new Error("Invite not found");

    await prisma.invite.delete({
      where: {
        id: inviteId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: invite };
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return { success: false, error: err.message };
  }
}

export async function rejectInvite({ inviteId }: { inviteId: string }) {
  try {
    if (!inviteId) throw new Error("Invite ID is required");

    const invite = await prisma.invite.findUnique({
      where: {
        id: inviteId,
      },
      include: {
        group: true,
        sender: true,
      },
    });

    if (!invite) throw new Error("Invite not found");

    await prisma.invite.delete({
      where: {
        id: inviteId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: invite };
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return { success: false, error: err.message };
  }
}
