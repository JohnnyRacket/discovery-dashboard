import { Client, Session } from "@/lib/types"
import { FollowUpEntry } from "@/lib/data/follow-ups"
import { SessionList } from "./session-list"
import { FollowUpPanel } from "./follow-up-panel"
import { NeedsSummary } from "./needs-summary"
import { ClientHeader } from "./client-header"
import { Button } from "@/components/ui/button"
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
        <ClientHeader client={client} />
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
          <NeedsSummary clientId={client.id} initialNeeds={client.needsSummary} />
        </div>
      </div>
    </div>
  )
}
