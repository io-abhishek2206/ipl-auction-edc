import { connectDB } from "@/lib/db"
import { Team } from "@/models/Team"
import { getAuthFromRequest } from "@/lib/middleware"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { teamId: string } }) {
  try {
    const auth = getAuthFromRequest(request)

    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Team can only see their own data, admin can see all
    if (auth.role === "team" && auth.teamId !== params.teamId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const team = await Team.findById(params.teamId).populate("playersBought")

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      team: {
        id: team._id,
        name: team.name,
        balance: team.balance,
        points: team.points,
        playersBought: team.playersBought,
        totalPlayers: team.playersBought.length,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
