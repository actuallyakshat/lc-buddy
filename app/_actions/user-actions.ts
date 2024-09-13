"use server";
import prisma from "@/db";

interface GetUserDetailsProps {
  clerkId: string;
  email: string;
  name: string;
}

interface User {
  id: string;
  clerkId: string;
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
}: GetUserDetailsProps): Promise<{ success: boolean; data?: User; error?: string }> {
  try {
    // Validate Input
    if (!clerkId || !email || !name) throw new Error("Invalid user details");

    const user = await prisma.user.findUnique({
      where: {
        clerkId,
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
}: GetUserDetailsProps): Promise<{ success: boolean; data?: User; error?: string }> {
  try {
    // Create new user
    const user = await prisma.user.create({
      data: {
        clerkId,
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
