import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PlayerCardProps {
  name: string
  role: string
  basePrice?: number
  soldPrice?: number
  status?: "sold" | "unsold"
}

export function PlayerCard({ name, role, basePrice, soldPrice, status }: PlayerCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Role:</span>
          <span className="capitalize font-medium">{role}</span>
        </div>
        {basePrice && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Base Price:</span>
            <span className="font-medium">₹{basePrice.toLocaleString()}</span>
          </div>
        )}
        {soldPrice && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sold Price:</span>
            <span className="font-medium text-green-600">₹{soldPrice.toLocaleString()}</span>
          </div>
        )}
        {status && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <span className={`capitalize font-medium ${status === "sold" ? "text-green-600" : "text-gray-400"}`}>
              {status}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
