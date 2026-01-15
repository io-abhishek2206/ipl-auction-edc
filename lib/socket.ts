import type { Server as HTTPServer } from "http"
import { Server as SocketIOServer, type Socket } from "socket.io"

let io: SocketIOServer | null = null

export function initSocketIO(httpServer: HTTPServer): SocketIOServer {
  if (!io) {
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_APP_URL : "*",
        methods: ["GET", "POST"],
      },
    })

    io.on("connection", (socket: Socket) => {
      console.log(`[Socket] User connected: ${socket.id}`)

      socket.on("disconnect", () => {
        console.log(`[Socket] User disconnected: ${socket.id}`)
      })
    })
  }

  return io
}

export function getSocketIO(): SocketIOServer | null {
  return io
}

export function emitPlayerSold(playerId: string, teamId: string, soldPrice: number, playerName: string) {
  if (io) {
    io.emit("player_sold", {
      playerId,
      teamId,
      soldPrice,
      playerName,
      timestamp: new Date(),
    })
  }
}

export function emitTeamUpdate(teamId: string, updates: any) {
  if (io) {
    io.emit("team_updated", {
      teamId,
      ...updates,
      timestamp: new Date(),
    })
  }
}

export function emitAuctionUpdate(data: any) {
  if (io) {
    io.emit("auction_update", {
      ...data,
      timestamp: new Date(),
    })
  }
}
