import { connectDB } from "@/lib/db"
import { Player } from "@/models/Player"
import { getAuthFromRequest } from "@/lib/middleware"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request)

    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const players = await Player.find().sort({ createdAt: -1 })

    return NextResponse.json({ success: true, players })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request)

    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { name, role, basePrice } = await request.json()

    if (!name || !role || !basePrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const player = await Player.create({
      name,
      role,
      basePrice,
    })

    return NextResponse.json({ success: true, player }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
