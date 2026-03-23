import { NextResponse } from "next/server";

const MOCK_STORIES = [
  { username: "yourhandle", seed: "current", isOwn: true },
  { username: "alex.photo", seed: "alex", isOwn: false },
  { username: "maya.art", seed: "maya", isOwn: false },
  { username: "javier.cooks", seed: "javier", isOwn: false },
  { username: "sofia.travels", seed: "sofia", isOwn: false },
  { username: "kai.fitness", seed: "kai", isOwn: false },
];

export async function GET() {
  return NextResponse.json(MOCK_STORIES);
}