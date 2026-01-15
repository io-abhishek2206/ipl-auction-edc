import { connectDB } from "@/lib/db"
import { Player } from "@/models/Player"
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

    const teams = await Team.find()
    const players = await Player.find()

    const soldPlayers = players.filter((p) => p.status === "sold")
    const totalSpent = soldPlayers.reduce((sum, p) => sum + (p.soldPrice || 0), 0)

    return NextResponse.json({
      success: true,
      stats: {
        totalTeams: teams.length,
        totalPlayers: players.length,
        soldPlayers: soldPlayers.length,
        unsoldPlayers: players.length - soldPlayers.length,
        totalSpent,
        avgPricePerPlayer: soldPlayers.length > 0 ? totalSpent / soldPlayers.length : 0,
        averageTeamBalance: teams.length > 0 ? teams.reduce((sum, t) => sum + t.balance, 0) / teams.length : 0,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
