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
        `https://leetcode-stats-api.herokuapp.com/${user.id}`,
      );
      const data = await response.json();
      return {
        ...data,
        name: user.name,
      };
    }),
  );

  console.log("leetcodeUserData", leetcodeUserData);
  return leetcodeUserData;
}
