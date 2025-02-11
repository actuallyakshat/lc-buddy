interface LeetcodeIdAndName {
  id: string;
  name: string;
}

export async function getLeetcodeUserData(users: LeetcodeIdAndName[]) {
  const results = await Promise.all(
    users.map(async (user) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/leetcode?id=${user.id}`,
        );

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();
        return {
          ...data,
          name: user.name,
          id: user.id,
          status: response.status,
        };
      } catch (error) {
        return {
          error:
            error instanceof Error ? error.message : "Failed to fetch data",
          status: 500,
          name: user.name,
          id: user.id,
        };
      }
    }),
  );

  return results;
}
