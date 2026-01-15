import { connectDB } from "@/lib/db"
import { Player } from "@/models/Player"
import { getAuthFromRequest } from "@/lib/middleware"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthFromRequest(request)

    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { name, role, basePrice, status, soldPrice, soldToTeamId } = await request.json()

    const player = await Player.findByIdAndUpdate(
      params.id,
      { name, role, basePrice, status, soldPrice, soldToTeamId },
      { new: true },
    )

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, player })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = getAuthFromRequest(request)

    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const player = await Player.findByIdAndDelete(params.id)

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Player deleted" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
