"use server";
import prisma from "@/db";
import { revalidatePath } from "next/cache";

interface GetUserDetailsProps {
  clerkId: string;
  email: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  leetcodeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserDetails({
  clerkId,
  email,
  name,
}: GetUserDetailsProps): Promise<{
  success: boolean;
  data?: User;
  error?: string;
}> {
  try {
    // Validate Input
    if (
      !clerkId ||
      !email ||
      !name ||
      clerkId.trim() == "" ||
      email.trim() == "" ||
      name.trim() == ""
    )
      throw new Error("Invalid user details");

    const user = await prisma.user.findUnique({
      where: {
        id: clerkId,
      },
    });

    // Create new user if not found
    if (!user) {
      const newUser = await createNewUser({ clerkId, email, name });
      return { success: true, data: newUser.data }; // ensure data is returned correctly
    }

    // Return user if found
    return { success: true, data: user };
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return { success: false, error: err.message };
  }
}

async function createNewUser({
  clerkId,
  email,
  name,
}: GetUserDetailsProps): Promise<{
  success: boolean;
  data?: User;
  error?: string;
}> {
  try {
    // Create new user
    const user = await prisma.user.create({
      data: {
        id: clerkId,
        email,
        name,
      },
    });
    return { success: true, data: user };
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return { success: false, error: err.message };
  }
}

export async function updateLeetcodeId(clerkId: string, leetcodeId: string) {
  try {
    // Validate Input
    if (
      !clerkId ||
      clerkId.trim() == "" ||
      !leetcodeId ||
      leetcodeId.trim() == ""
    )
      throw new Error("Invalid Leetcode ID");

    //GET URL FROM ENV
    const response = await fetch(process.env.LEETCODE_API + leetcodeId);
    const data = await response.json();

    console.log(process.env.LEETCODE_API + leetcodeId);
    console.log(data);

    if (data.status == "error") throw new Error("Invalid Leetcode ID");

    const user = await prisma.user.findUnique({
      where: {
        id: clerkId,
      },
    });

    //User not found
    if (!user) throw new Error("User not found");

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id: clerkId,
      },
      data: {
        leetcodeId,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, data: updatedUser };
  } catch (error: any) {
    console.error(error.message);
    return { success: false, error: error.message };
  }
}

export async function updateUserDetails({
  clerkId,
  name,
  leetcodeId,
}: {
  clerkId: string;
  name: string;
  leetcodeId: string;
}) {
  try {
    // Validate Input
    if (
      !clerkId ||
      clerkId.trim() == "" ||
      !name ||
      name.trim() == "" ||
      !leetcodeId ||
      leetcodeId.trim() == ""
    )
      throw new Error("Invalid user details");

    const user = await prisma.user.findUnique({
      where: {
        id: clerkId,
      },
    });

    // User not found
    if (!user) throw new Error("User not found");

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id: clerkId,
      },
      data: {
        name,
        leetcodeId,
      },
    });

    return { success: true, data: updatedUser };
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return { success: false, error: err.message };
  }
}
