"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TeamStatsCard } from "@/components/team-stats-card"

interface TeamInfo {
  id: string
  name: string
  balance: number
  points: number
  totalPlayers: number
}

export default function AdminTeamsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [teams, setTeams] = useState<TeamInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === "admin") {
      fetchTeams()
    }
  }, [user])

  const fetchTeams = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/teams")
      const data = await response.json()

      if (data.success) {
        setTeams(data.teams)
      }
    } catch (error) {
      console.error("Error fetching teams:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">All Teams</h1>
          <Button onClick={() => router.back()}>Back</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Teams Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <TeamStatsCard label="Total Teams" value={teams.length} />
              <TeamStatsCard
                label="Total Spent"
                value={`₹${teams.reduce((acc, t) => acc + (1000000 - t.balance), 0).toLocaleString()}`}
              />
              <TeamStatsCard label="Total Players Sold" value={teams.reduce((acc, t) => acc + t.totalPlayers, 0)} />
              <TeamStatsCard
                label="Avg Balance"
                value={`₹${Math.round(teams.reduce((acc, t) => acc + t.balance, 0) / teams.length).toLocaleString()}`}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {teams.map((team) => (
            <Card key={team.id}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <h3 className="font-bold text-lg">{team.name}</h3>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="font-bold">₹{team.balance.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Points</p>
                    <p className="font-bold">{team.points}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Players</p>
                    <p className="font-bold">{team.totalPlayers}</p>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
