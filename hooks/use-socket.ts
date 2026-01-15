"use client"

import { useEffect, useState, useCallback } from "react"
import { io as ioClient, type Socket } from "socket.io-client"

interface SocketEvents {
  player_sold?: (data: any) => void
  team_updated?: (data: any) => void
  auction_update?: (data: any) => void
  [key: string]: ((data: any) => void) | undefined
}

export function useSocket(events?: SocketEvents) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin
    const newSocket = ioClient(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    newSocket.on("connect", () => {
      console.log("[Socket] Connected to server")
      setIsConnected(true)
    })

    newSocket.on("disconnect", () => {
      console.log("[Socket] Disconnected from server")
      setIsConnected(false)
    })

    if (events) {
      Object.entries(events).forEach(([event, handler]) => {
        if (handler) {
          newSocket.on(event, handler)
        }
      })
    }

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const emit = useCallback(
    (event: string, data?: any) => {
      if (socket?.connected) {
        socket.emit(event, data)
      }
    },
    [socket],
  )

  return { socket, isConnected, emit }
}
