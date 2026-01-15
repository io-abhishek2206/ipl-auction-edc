"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"

interface TeamHeaderProps {
  teamName: string
}

export function TeamHeader({ teamName }: TeamHeaderProps) {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <header className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{teamName}</h1>
          <p className="text-muted-foreground mt-1">Team Dashboard</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  )
}
