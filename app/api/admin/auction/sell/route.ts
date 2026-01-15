import { connectDB } from "@/lib/db"
import { Player } from "@/models/Player"
import { Team } from "@/models/Team"
import { getAuthFromRequest } from "@/lib/middleware"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request)

    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { playerId, teamId, soldPrice } = await request.json()

    if (!playerId || !teamId || !soldPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const player = await Player.findById(playerId)
    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    const team = await Team.findById(teamId)
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    if (team.balance < soldPrice) {
      return NextResponse.json({ error: "Insufficient team balance" }, { status: 400 })
    }

    // Update player
    player.status = "sold"
    player.soldPrice = soldPrice
    player.soldToTeamId = teamId
    await player.save()

    // Update team
    team.balance -= soldPrice
    team.playersBought.push(playerId)
    await team.save()

    return NextResponse.json({
      success: true,
      message: "Player sold successfully",
      player,
      team,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
