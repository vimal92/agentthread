import { NextResponse } from "next/server";
import { AGENTS } from "@/lib/mock-data";

export function GET() {
  return NextResponse.json({ agents: AGENTS, total: AGENTS.length });
}
