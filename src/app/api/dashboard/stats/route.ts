import { NextResponse } from "next/server";
import { inventoryService } from "@/services/inventory.service";

export async function GET() {
  try {
    const stats = await inventoryService.getDashboardStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    console.error("GET /api/dashboard/stats Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
