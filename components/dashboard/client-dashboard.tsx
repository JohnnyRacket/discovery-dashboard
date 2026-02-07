import { Client, Session } from "@/lib/types"
import { FollowUpEntry } from "@/lib/data/follow-ups"
import { SessionList } from "./session-list"
import { FollowUpPanel } from "./follow-up-panel"
import { NeedsSummary } from "./needs-summary"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface ClientDashboardProps {
  client: Client
  sessions: Session[]
  followUps: FollowUpEntry[]
}

export function ClientDashboard({ client, sessions, followUps }: ClientDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{client.name}</h1>
          <p className="text-muted-foreground">{client.company}</p>
          <div className="flex gap-2 mt-2">
            {client.industry && <Badge variant="secondary">{client.industry}</Badge>}
            {client.contactEmail && (
              <span className="text-sm text-muted-foreground">{client.contactEmail}</span>
            )}
          </div>
        </div>
        <Button asChild>
          <Link href={`/clients/${client.id}/sessions/new`}>New Session</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Sessions</h2>
          <SessionList sessions={sessions} clientId={client.id} />
        </div>
        <div className="space-y-4">
          <FollowUpPanel followUps={followUps} clientId={client.id} />
          <NeedsSummary />
        </div>
      </div>
    </div>
  )
}
