"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { TeamStatsCard } from "@/components/team-stats-card"
import { PlayerCard } from "@/components/player-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TeamData {
  id: string
  name: string
  balance: number
  points: number
  playersBought: any[]
  totalPlayers: number
}

export default function TeamDashboard() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [team, setTeam] = useState<TeamData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.role !== "team")) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === "team" && user.teamId) {
      fetchTeamData()
    }
  }, [user])

  const fetchTeamData = async () => {
    if (!user?.teamId) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/teams/${user.teamId}`)
      const data = await response.json()

      if (data.success) {
        setTeam(data.team)
      }
    } catch (error) {
      console.error("Error fetching team data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (loading || !team) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!user || user.role !== "team") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{team.name}</h1>
            <p className="text-muted-foreground mt-1">Team Dashboard</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <TeamStatsCard label="Remaining Balance" value={`₹${team.balance.toLocaleString()}`} variant="success" />
          <TeamStatsCard label="Total Points" value={team.points} variant="warning" />
          <TeamStatsCard label="Players Bought" value={team.totalPlayers} />
          <TeamStatsCard
            label="Avg Player Cost"
            value={
              team.totalPlayers > 0
                ? `₹${Math.round((1000000 - team.balance) / team.totalPlayers).toLocaleString()}`
                : "N/A"
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Players in Squad ({team.totalPlayers})</CardTitle>
              </CardHeader>
              <CardContent>
                {team.playersBought.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {team.playersBought.map((player) => (
                      <PlayerCard
                        key={player._id}
                        name={player.name}
                        role={player.role}
                        basePrice={player.basePrice}
                        soldPrice={player.soldPrice}
                        status={player.status}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No players bought yet</p>
                    <p className="text-sm">Players will appear here once they are sold to your team</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Budget Status</p>
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full"
                      style={{ width: `${100 - (team.balance / 1000000) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round(((1000000 - team.balance) / 1000000) * 100)}% spent
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">Team Info</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Initial Budget:</span>
                      <span className="font-medium">₹10,00,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Spent:</span>
                      <span className="font-medium">₹{(1000000 - team.balance).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
