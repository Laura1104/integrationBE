import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  return NextResponse.json({ following: true, username });
}