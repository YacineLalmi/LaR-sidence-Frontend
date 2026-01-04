import { CommuneService } from "@/services/commune.service";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    // Assuming your service has a method to fetch communes by wilaya ID
    const communes = await CommuneService.list(id);

    if (!communes) {
      return NextResponse.json({ error: "Wilaya not found" }, { status: 404 });
    }

    return NextResponse.json(communes);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
