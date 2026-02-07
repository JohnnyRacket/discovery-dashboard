import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Session } from "@/lib/types"

interface SessionCardProps {
  session: Session
}

export function SessionCard({ session }: SessionCardProps) {
  const itemCount = session.discoveryItems.length
  const subItemCount = session.discoveryItems.reduce((sum, item) => sum + item.subItems.length, 0)
  const followUpCount = session.discoveryItems.reduce(
    (sum, item) => sum + item.subItems.filter((s) => (s.type === "follow-up" || s.type === "action-item") && !s.resolved).length,
    0
  )

  return (
    <Link href={`/clients/${session.clientId}/sessions/${session.id}`}>
      <Card className="hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base">{session.title}</CardTitle>
              <CardDescription>{session.date}</CardDescription>
            </div>
            <Badge variant={session.status === "active" ? "default" : "secondary"}>
              {session.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span>{itemCount} topics</span>
            <span>{subItemCount} items</span>
            {followUpCount > 0 && (
              <span className="text-amber-600 font-medium">{followUpCount} open follow-ups</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
