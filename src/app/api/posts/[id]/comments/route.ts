import { NextRequest, NextResponse } from "next/server";
import { MOCK_POSTS, CURRENT_USER } from "@/lib/mock-data";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { text } = await req.json();

  const post = MOCK_POSTS.find((p) => p.id === id);
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const newComment = {
    id: `comment_${Date.now()}`,
    text,
    author: CURRENT_USER,
    createdAt: new Date().toISOString(),
    likesCount: 0,
  };

  post.comments.push(newComment);
  post.commentsCount += 1;

  return NextResponse.json(newComment, { status: 201 });
}