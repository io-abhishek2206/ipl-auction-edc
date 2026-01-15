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

    const { playerId, teamId } = await request.json()

    if (!playerId || !teamId) {
      return NextResponse.json({ error: "Player ID and Team ID required" }, { status: 400 })
    }

    const player = await Player.findById(playerId)
    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    const team = await Team.findById(teamId)
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    if (player.status !== "sold") {
      return NextResponse.json({ error: "Player is not sold" }, { status: 400 })
    }

    // Revert player
    player.status = "unsold"
    player.soldPrice = undefined
    player.soldToTeamId = undefined
    await player.save()

    // Revert team
    team.balance += player.soldPrice || 0
    team.playersBought = team.playersBought.filter((id) => id.toString() !== playerId)
    await team.save()

    return NextResponse.json({
      success: true,
      message: "Player unsold successfully",
      player,
      team,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
