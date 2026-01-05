import { RoleService } from "@/services/role.service";
import { UserService } from "@/services/user.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await RoleService.list();
    return NextResponse.json(res);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
