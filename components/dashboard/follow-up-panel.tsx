import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FollowUpEntry } from "@/lib/data/follow-ups"
import { SUB_ITEM_TYPE_CONFIG } from "@/lib/constants"
import Link from "next/link"

interface FollowUpPanelProps {
  followUps: FollowUpEntry[]
  clientId: string
}

export function FollowUpPanel({ followUps, clientId }: FollowUpPanelProps) {
  if (followUps.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Follow-ups & Action Items</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No open follow-ups</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Follow-ups & Action Items ({followUps.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {followUps.map((entry, i) => {
          const config = SUB_ITEM_TYPE_CONFIG[entry.subItem.type]
          return (
            <Link
              key={i}
              href={`/clients/${clientId}/sessions/${entry.sessionId}`}
              className="block"
            >
              <div className="flex items-start gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors">
                <span className="text-sm flex-shrink-0">{config.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{entry.subItem.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.discoveryItemTitle}
                    {entry.subItem.dueDate && (
                      <span className="ml-2">Due: {entry.subItem.dueDate}</span>
                    )}
                  </p>
                </div>
                <Badge variant="secondary" className={`text-xs shrink-0 ${config.color} ${config.bgColor}`}>
                  {config.label}
                </Badge>
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
