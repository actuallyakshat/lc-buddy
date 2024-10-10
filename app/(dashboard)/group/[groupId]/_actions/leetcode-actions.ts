"use server";

interface LeetcodeIdAndName {
  id: string;
  name: string;
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 3, backoff = 300) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    } else {
      throw error;
    }
  }
}

export async function getLeetcodeUserData(
  leetcodeIdAndName: LeetcodeIdAndName[],
) {
  const leetcodeUserData = await Promise.all(
    leetcodeIdAndName.map(async (user) => {
      try {
        const response = await fetchWithRetry(
          `${process.env.LEETCODE_API}/userProfile/${user.id}`,
          {
            next: {
              revalidate: 600, // Revalidate every 10 minutes
            },
          }
        );

        const data = await response.json();
        return {
          ...data,
          name: user.name,
        };
      } catch (error: any) {
        console.error(`Error fetching data for user ${user.id}:`, error);
        return {
          error: `Failed to fetch data for user ${user.id}`,
          name: user.name,
        };
      }
    }),
  );

  return leetcodeUserData;
}