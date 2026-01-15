"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RealTimeUpdates } from "@/components/real-time-updates"

interface Player {
  _id: string
  name: string
  role: string
  basePrice: number
  status: "sold" | "unsold"
  soldPrice?: number
}

interface Team {
  _id: string
  name: string
  balance: number
}

export default function AuctionPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [soldPrice, setSoldPrice] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === "admin") {
      fetchPlayers()
      fetchTeams()
    }
  }, [user])

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/admin/players")
      const data = await response.json()
      if (data.success) {
        setPlayers(data.players.filter((p: Player) => p.status === "unsold"))
      }
    } catch (error) {
      console.error("Error fetching players:", error)
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams")
      const data = await response.json()
      if (data.success) {
        setTeams(data.teams)
      }
    } catch (error) {
      console.error("Error fetching teams:", error)
    }
  }

  const handleSellPlayer = async () => {
    if (!selectedPlayer || !selectedTeam || !soldPrice) {
      alert("Please select player, team, and enter price")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/auction/sell-with-socket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: selectedPlayer,
          teamId: selectedTeam,
          soldPrice,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSelectedPlayer(null)
        setSelectedTeam(null)
        setSoldPrice(0)
        fetchPlayers()
        fetchTeams()
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error("Error selling player:", error)
      alert("Error selling player")
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

  const selectedPlayerData = players.find((p) => p._id === selectedPlayer)
  const selectedTeamData = teams.find((t) => t._id === selectedTeam)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Auction Control</h1>
          <Button onClick={() => router.back()}>Back</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sell Player</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Player</label>
                <select
                  value={selectedPlayer || ""}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">Choose a player...</option>
                  {players.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.role}) - Base: ₹{p.basePrice}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select Team</label>
                <select
                  value={selectedTeam || ""}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">Choose a team...</option>
                  {teams.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} (Balance: ₹{t.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sold Price</label>
                <input
                  type="number"
                  value={soldPrice}
                  onChange={(e) => setSoldPrice(Number.parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  placeholder="Enter sold price"
                />
              </div>

              {selectedPlayerData && selectedTeamData && (
                <Card className="bg-muted">
                  <CardContent className="pt-6 space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Player</p>
                      <p className="font-bold">{selectedPlayerData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Team</p>
                      <p className="font-bold">{selectedTeamData.name}</p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Team Balance After Sale:</span>
                      <span className="font-bold">₹{(selectedTeamData.balance - soldPrice).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={handleSellPlayer}
                className="w-full"
                disabled={isLoading || !selectedPlayer || !selectedTeam || !soldPrice}
              >
                {isLoading ? "Processing..." : "Confirm Sale"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Players ({players.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {players.map((p) => (
                  <div
                    key={p._id}
                    className={`p-3 border rounded cursor-pointer transition ${selectedPlayer === p._id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                    onClick={() => setSelectedPlayer(p._id)}
                  >
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm">
                      {p.role} • Base: ₹{p.basePrice}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <RealTimeUpdates />
      </main>
    </div>
  )
}
