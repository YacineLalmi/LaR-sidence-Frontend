import { WilayaService } from "@/services/wilaya.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await WilayaService.list();

    return NextResponse.json(res);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
