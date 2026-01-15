import { connectDB } from "@/lib/db"
import { Team } from "@/models/Team"
import { getAuthFromRequest } from "@/lib/middleware"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request)

    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const teams = await Team.find().sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      teams: teams.map((team) => ({
        id: team._id,
        name: team.name,
        balance: team.balance,
        points: team.points,
        totalPlayers: team.playersBought.length,
      })),
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
