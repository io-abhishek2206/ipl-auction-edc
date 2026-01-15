import { connectDB } from "@/lib/db"
import { Player } from "@/models/Player"
import { getAuthFromRequest } from "@/lib/middleware"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request)

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const players = await Player.find().sort({ soldPrice: -1 })

    const stats = {
      byRole: {
        batsman: players.filter((p) => p.role === "batsman"),
        bowler: players.filter((p) => p.role === "bowler"),
        allRounder: players.filter((p) => p.role === "all-rounder"),
      },
      byStatus: {
        sold: players.filter((p) => p.status === "sold"),
        unsold: players.filter((p) => p.status === "unsold"),
      },
      highestPricedSold: players.filter((p) => p.status === "sold").slice(0, 5),
    }

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
