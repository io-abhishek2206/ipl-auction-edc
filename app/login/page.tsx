"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, login, error } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else if (user.role === "team") {
        router.push("/team/dashboard")
      }
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)
    setIsLoading(true)

    const success = await login(username, password)

    if (!success) {
      setLoginError(error || "Login failed. Please try again.")
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">IPL Auction</h1>
          <p className="text-slate-300">College Event Management System</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <p className="text-sm text-center text-muted-foreground">
              Enter your credentials to access the auction system
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">{loginError}</div>
              )}

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading} size="lg">
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground text-center mb-4">Demo Credentials</p>
              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-3 rounded">
                  <p className="font-medium text-slate-900">Admin</p>
                  <p className="text-slate-600">Username: admin</p>
                  <p className="text-slate-600">Password: admin@123</p>
                </div>
                <div className="bg-slate-50 p-3 rounded">
                  <p className="font-medium text-slate-900">Team</p>
                  <p className="text-slate-600">Username: mumbaindians</p>
                  <p className="text-slate-600">Password: team@123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-slate-400 text-sm mt-6">© 2025 IPL Auction System. All rights reserved.</p>
      </div>
    </div>
  )
}
