"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { PlayerForm } from "@/components/player-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPlayersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [players, setPlayers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user?.role === "admin") {
      fetchPlayers()
    }
  }, [user])

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/admin/players")
      const data = await response.json()
      if (data.success) {
        setPlayers(data.players)
      }
    } catch (error) {
      console.error("Error fetching players:", error)
    }
  }

  const handleSubmit = async (formData: any) => {
    setIsLoading(true)
    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/admin/players/${editingId}` : "/api/admin/players"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setEditingId(null)
        fetchPlayers()
      }
    } catch (error) {
      console.error("Error saving player:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return

    try {
      const response = await fetch(`/api/admin/players/${id}`, { method: "DELETE" })
      const data = await response.json()

      if (data.success) {
        fetchPlayers()
      }
    } catch (error) {
      console.error("Error deleting player:", error)
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
          <h1 className="text-3xl font-bold">Players Management</h1>
          <Button onClick={() => router.back()}>Back</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <PlayerForm
            initialData={editingId ? players.find((p) => p._id === editingId) : undefined}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Players ({players.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {players.map((player) => (
                  <div key={player._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{player.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {player.role} • ₹{player.basePrice}
                      </p>
                      {player.status === "sold" && <p className="text-xs text-green-600">Sold: ₹{player.soldPrice}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingId(player._id)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(player._id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
