export const maxDuration = 60; // Limit execution to 60 seconds

import { NextRequest, NextResponse } from 'next/server';

interface LeetcodeIdAndName {
  id: string;
  name: string;
}

async function getLeetcodeUserData(leetcodeIdAndName: LeetcodeIdAndName[]) {
  const leetcodeUserData = await Promise.all(
    leetcodeIdAndName.map(async (user) => {
      const url = `${process.env.LEETCODE_API}/userProfile/${user.id}`;
      console.log(`Fetching data for user ${user.name} (ID: ${user.id}) from URL: ${url}`);

      try {
        const response = await fetch(url, {
          next: {
            revalidate: 600, // Revalidate cache every 10 minutes
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Successfully fetched data for user ${user.name} (ID: ${user.id})`);
        
        return {
          ...data,
          name: user.name,
          id: user.id,
          status: response.status,
        };
      } catch (error: any) {
        console.error(`Failed to fetch data for user ${user.name} (ID: ${user.id}): ${error.message}`);
        return {
          error: `Failed to fetch data: ${error.message}`,
          status: 500,
          name: user.name,
          id: user.id,
        };
      }
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
