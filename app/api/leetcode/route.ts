import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const url = `${process.env.LEETCODE_API}/userProfile/${id}`;

  const res = await fetch(url, {
    next: { revalidate: 600 }, // Cache for 10 minutes
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}