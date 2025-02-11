import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${process.env.LEETCODE_API}/userProfile/${id}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Failed to fetch LeetCode data for ID ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch LeetCode data" },
      { status: 500 },
    );
  }
}
