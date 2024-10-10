import { NextRequest, NextResponse } from 'next/server';

interface LeetcodeIdAndName {
  id: string;
  name: string;
}

interface FetchResult {
  data?: any;
  error?: string;
  status: number;
}

async function fetchWithExtendedRetry(
  url: string,
  options: RequestInit,
  isFirstRequest = false
): Promise<FetchResult> {
  const maxRetries = isFirstRequest ? 12 : 3; // More retries for first request
  const initialBackoff = isFirstRequest ? 5000 : 1000; // 5 seconds initial wait for first request
  const maxBackoff = 60000; // Maximum backoff of 1 minute

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1} for URL: ${url}`);
      const response = await fetch(url, options);

      if (response.ok) {
        const data = await response.json();
        return { status: response.status, data };
      }

      console.error(`HTTP error! status: ${response.status}, URL: ${url}, Attempt: ${attempt + 1}`);

      if (attempt < maxRetries - 1) {
        const backoff = Math.min(initialBackoff * Math.pow(2, attempt), maxBackoff);
        console.log(`Waiting for ${backoff}ms before next attempt...`);
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    } catch (error: any) {
      console.error(`Fetch error: ${error.message}, URL: ${url}, Attempt: ${attempt + 1}`);

      if (attempt < maxRetries - 1) {
        const backoff = Math.min(initialBackoff * Math.pow(2, attempt), maxBackoff);
        console.log(`Waiting for ${backoff}ms before next attempt...`);
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    }
  }

  return { status: 0, error: `Failed after ${maxRetries} attempts` };
}

async function getLeetcodeUserData(leetcodeIdAndName: LeetcodeIdAndName[]) {
  let isFirstRequest = true;

  const leetcodeUserData = await Promise.all(
    leetcodeIdAndName.map(async (user) => {
      const url = `${process.env.LEETCODE_API}/userProfile/${user.id}`;
      console.log(`Fetching data for user ${user.name} (ID: ${user.id}) from URL: ${url}`);

      const result = await fetchWithExtendedRetry(
        url,
        {
          next: {
            revalidate: 600, // Revalidate every 10 minutes
          },
        },
        isFirstRequest
      );

      isFirstRequest = false; // Set to false after the first request

      if (result.error || !result.data) {
        console.error(`Failed to fetch data for user ${user.name} (ID: ${user.id}): ${result.error}`);
        return {
          error: `Failed to fetch data: ${result.error}`,
          status: result.status,
          name: user.name,
          id: user.id,
        };
      }

      console.log(`Successfully fetched data for user ${user.name} (ID: ${user.id})`);
      return {
        ...result.data,
        name: user.name,
        id: user.id,
        status: result.status,
      };
    })
  );

  return leetcodeUserData;
}

// POST method for the new API route
export async function POST(req: NextRequest) {
  try {
    
    const { leetcodeIdAndName } = await req.json(); // Parse request body
    if (!leetcodeIdAndName || !Array.isArray(leetcodeIdAndName)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const data = await getLeetcodeUserData(leetcodeIdAndName);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching Leetcode user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Optional: Handle other methods
export function OPTIONS() {
  return NextResponse.json({ message: 'OPTIONS request successful' }, { status: 200 });
}

export const config = {
  api: {
    maxDuration: 120,
  }
};