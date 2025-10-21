import { UserService } from "@/services/users.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // ✅ Example: call your backend service
    const res = await UserService.agentList();
    console.log(res);
    // ✅ Assume backend returns something like: ["USA", "Canada", "Mexico"]
    return NextResponse.json(res);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
