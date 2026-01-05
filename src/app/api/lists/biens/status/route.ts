import { BienStatusService } from "@/services/bien-status.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await BienStatusService.list();

    return NextResponse.json(res);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
