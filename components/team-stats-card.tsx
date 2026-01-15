import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TeamStatsCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  variant?: "default" | "success" | "warning"
}

export function TeamStatsCard({ label, value, icon, variant = "default" }: TeamStatsCardProps) {
  const bgColors = {
    default: "bg-blue-50 dark:bg-blue-950",
    success: "bg-green-50 dark:bg-green-950",
    warning: "bg-yellow-50 dark:bg-yellow-950",
  }

  return (
    <Card className={bgColors[variant]}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}
