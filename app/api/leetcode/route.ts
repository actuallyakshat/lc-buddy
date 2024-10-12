import { NextResponse } from "next/server";

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempt ${i + 1} to fetch data from ${url}`);
      const res = await fetch(url, options);
      if (res.ok) {
        console.log(`Successfully fetched data from ${url}`);
        return res;
      }
      console.warn(`Attempt ${i + 1} failed with status ${res.status}`);
    } catch (error) {
      console.error(`Attempt ${i + 1} failed with error:`, error);
    }
    if (i < maxRetries - 1) {
      const delay = Math.pow(2, i) * 1000; // Exponential backoff
      console.log(`Waiting ${delay}ms before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error(`Failed to fetch after ${maxRetries} attempts`);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    console.warn('API request made without ID');
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const url = `${process.env.LEETCODE_API}/userProfile/${id}`;
  console.log(`Fetching LeetCode data for user ID: ${id}`);

  try {
    const cacheTimestamp = Date.now();
    const res = await fetchWithRetry(url, {
      next: { revalidate: 600 }, // Cache for 10 minutes
    });

    const data = await res.json();
    const isCached = cacheTimestamp - Date.now() < 50; // Assume it's cached if fetch took less than 50ms

    console.log(`Data for user ID ${id} was ${isCached ? 'served from cache' : 'freshly fetched'}`);
    
    return NextResponse.json({
      ...data,
      _cacheInfo: {
        isCached: isCached,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(`Failed to fetch data for user ID: ${id}`, error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
