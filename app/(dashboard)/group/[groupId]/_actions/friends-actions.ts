"use server";

import prisma from "@/db";

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
    });

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

    const invites = await prisma.invite.findMany({
      where: {
        receiverId: userId,
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

    return { success: true, data: membership };
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return { success: false, error: err.message };
  }
}
