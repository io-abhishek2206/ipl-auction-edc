"use client"

import { useState } from "react"
import { useSocket } from "@/hooks/use-socket"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UpdateEvent {
  id: string
  type: "player_sold" | "team_updated" | "auction_update"
  message: string
  timestamp: Date
}

export function RealTimeUpdates() {
  const [updates, setUpdates] = useState<UpdateEvent[]>([])

  const handlePlayerSold = (data: any) => {
    setUpdates((prev) => [
      {
        id: Math.random().toString(),
        type: "player_sold",
        message: `${data.playerName} sold to team for ₹${data.soldPrice.toLocaleString()}`,
        timestamp: new Date(),
      },
      ...prev.slice(0, 9),
    ])
  }

  const handleTeamUpdate = (data: any) => {
    setUpdates((prev) => [
      {
        id: Math.random().toString(),
        type: "team_updated",
        message: `Team updated - Balance: ₹${data.balance.toLocaleString()}`,
        timestamp: new Date(),
      },
      ...prev.slice(0, 9),
    ])
  }

  const { isConnected } = useSocket({
    player_sold: handlePlayerSold,
    team_updated: handleTeamUpdate,
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Live Updates</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-xs text-muted-foreground">{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {updates.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Waiting for updates...</p>
          ) : (
            updates.map((update) => (
              <div key={update.id} className="p-3 border rounded-lg text-sm">
                <p className="font-medium">{update.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{update.timestamp.toLocaleTimeString()}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
