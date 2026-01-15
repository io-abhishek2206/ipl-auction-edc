"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
      } else if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else if (user.role === "team") {
        router.push("/team/dashboard")
      }
    }
  }, [user, loading, router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">IPL Auction System</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
