import { connectDB } from "@/lib/db"
import { User } from "@/models/User"
import { verifyPassword, signToken } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    const user = await User.findOne({ username })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValid = await verifyPassword(password, user.passwordHash)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = signToken({
      id: user._id.toString(),
      username: user.username,
      role: user.role,
      teamId: user.teamId?.toString() || null,
    })

    const response = NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user._id.toString(),
          username: user.username,
          role: user.role,
          teamId: user.teamId?.toString() || null,
        },
      },
      { status: 200 },
    )

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
