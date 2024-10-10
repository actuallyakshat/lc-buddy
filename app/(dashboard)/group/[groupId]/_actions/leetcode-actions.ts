"use server";

interface LeetcodeIdAndName {
  id: string;
  name: string;
}

export async function getLeetcodeUserData(
  leetcodeIdAndName: LeetcodeIdAndName[],
) {
  const leetcodeUserData = await Promise.all(
    leetcodeIdAndName.map(async (user) => {
      const response = await fetch(
        `${process.env.LEETCODE_API}/userProfile/${user.id}`,
        {
          cache: "force-cache", // Force cache for the response
          next: {
            revalidate: 600, // Revalidate every 10 minutes
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data for user ${user.id}`);
      }

      const data = await response.json();
      return {
        ...data,
        name: user.name,
      };
    }),
  );

  return leetcodeUserData;
}
