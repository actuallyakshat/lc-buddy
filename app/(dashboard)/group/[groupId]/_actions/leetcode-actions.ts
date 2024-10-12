// "use server";

// interface LeetcodeIdAndName {
//   id: string;
//   name: string;
// }

// interface FetchResult {
//   data?: any;
//   error?: string;
//   status: number;
// }

// async function fetchWithExtendedRetry(
//   url: string,
//   options: RequestInit,
//   isFirstRequest = false
// ): Promise<FetchResult> {
//   const maxRetries = isFirstRequest ? 12 : 3; // More retries for first request
//   const initialBackoff = isFirstRequest ? 5000 : 1000; // 5 seconds initial wait for first request
//   const maxBackoff = 60000; // Maximum backoff of 1 minute

//   for (let attempt = 0; attempt < maxRetries; attempt++) {
//     try {
//       console.log(`Attempt ${attempt + 1} for URL: ${url}`);
//       const response = await fetch(url, options);

//       if (response.ok) {
//         const data = await response.json();
//         return { status: response.status, data };
//       }

//       // Log the error and continue retrying for 404 or other statuses
//       console.error(`HTTP error! status: ${response.status}, URL: ${url}, Attempt: ${attempt + 1}`);
      
//       if (attempt < maxRetries - 1) {
//         const backoff = Math.min(initialBackoff * Math.pow(2, attempt), maxBackoff);
//         console.log(`Waiting for ${backoff}ms before next attempt...`);
//         await new Promise((resolve) => setTimeout(resolve, backoff));
//       }
//     } catch (error: any) {
//       console.error(`Fetch error: ${error.message}, URL: ${url}, Attempt: ${attempt + 1}`);

//       if (attempt < maxRetries - 1) {
//         const backoff = Math.min(initialBackoff * Math.pow(2, attempt), maxBackoff);
//         console.log(`Waiting for ${backoff}ms before next attempt...`);
//         await new Promise((resolve) => setTimeout(resolve, backoff));
//       }
//     }
//   }

//   return { status: 0, error: `Failed after ${maxRetries} attempts` };
// }

// export async function getLeetcodeUserData(leetcodeIdAndName: LeetcodeIdAndName[]) {
//   let isFirstRequest = true;

//   const leetcodeUserData = await Promise.all(
//     leetcodeIdAndName.map(async (user) => {
//       const url = `${process.env.LEETCODE_API}/userProfile/${user.id}`;
//       console.log(`Fetching data for user ${user.name} (ID: ${user.id}) from URL: ${url}`);

//       const result = await fetchWithExtendedRetry(
//         url,
//         {
//           next: {
//             revalidate: 600, // Revalidate every 10 minutes
//           },
//         },
//         isFirstRequest
//       );

//       isFirstRequest = false; // Set to false after the first request

//       if (result.error || !result.data) {
//         console.error(`Failed to fetch data for user ${user.name} (ID: ${user.id}): ${result.error}`);
//         return {
//           error: `Failed to fetch data: ${result.error}`,
//           status: result.status,
//           name: user.name,
//           id: user.id,
//         };
//       }

//       console.log(`Successfully fetched data for user ${user.name} (ID: ${user.id})`);
//       return {
//         ...result.data,
//         name: user.name,
//         id: user.id,
//         status: result.status,
//       };
//     })
//   );

//   return leetcodeUserData;
// }

import { cache } from 'react';

interface LeetcodeIdAndName {
  id: string;
  name: string;
}



export const getLeetcodeUserData = cache(async (leetcodeIdAndName: LeetcodeIdAndName[]) => {
  console.log('Fetching LeetCode data for users:', leetcodeIdAndName.map(u => u.name).join(', '));

  const leetcodeUserData = await Promise.all(
    leetcodeIdAndName.map(async (user) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/leetcode?id=${user.id}`);
        if (!response.ok) {
          console.error(`Failed to fetch data for user ${user.name} (ID: ${user.id}): ${response.statusText}`);
          return {
            error: `Failed to fetch data: ${response.statusText}`,
            status: response.status,
            name: user.name,
            id: user.id,
          };
        }
        const data: any = await response.json();
        console.log(`Data for user ${user.name} (ID: ${user.id}) was ${data._cacheInfo?.isCached ? 'served from cache' : 'freshly fetched'} at ${data._cacheInfo?.timestamp}`);
        return {
          ...data,
          name: user.name,
          id: user.id,
          status: response.status,
        };
      } catch (error) {
        console.error(`Error fetching data for user ${user.name} (ID: ${user.id}):`, error);
        return {
          error: `Error fetching data: ${error instanceof Error ? error.message : 'Unknown error'}`,
          status: 500,
          name: user.name,
          id: user.id,
        };
      }
    })
  );

  console.log('Finished fetching LeetCode data for all users');
  return leetcodeUserData;
});
