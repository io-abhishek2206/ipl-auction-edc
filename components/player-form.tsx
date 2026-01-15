"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface PlayerFormProps {
  initialData?: {
    id?: string
    name: string
    role: "batsman" | "bowler" | "all-rounder"
    basePrice: number
  }
  onSubmit: (data: any) => void
  isLoading?: boolean
}

export function PlayerForm({ initialData, onSubmit, isLoading }: PlayerFormProps) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      role: "batsman",
      basePrice: 0,
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData?.id ? "Edit Player" : "Add Player"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full px-3 py-2 border rounded-md bg-background"
              required
            >
              <option value="batsman">Batsman</option>
              <option value="bowler">Bowler</option>
              <option value="all-rounder">All-Rounder</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Base Price</label>
            <Input
              type="number"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: Number.parseFloat(e.target.value) })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Player"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
