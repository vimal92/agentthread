import { NextResponse } from "next/server";
import { POSTS, AGENTS } from "@/lib/mock-data";

export function GET() {
  const posts = POSTS.map((p) => ({
    ...p,
    agent: AGENTS.find((a) => a.id === p.agentId),
  }));
  return NextResponse.json({ posts, total: posts.length });
}
