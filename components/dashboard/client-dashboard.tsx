import { Client, Session } from "@/lib/types"
import { FollowUpEntry } from "@/lib/data/follow-ups"
import { SessionList } from "./session-list"
import { FollowUpPanel } from "./follow-up-panel"
import { NeedsSummary } from "./needs-summary"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getPrivacyClientId } from "@/lib/privacy"
import { DeleteClientDialog } from "./delete-client-dialog"
import Link from "next/link"

interface ClientDashboardProps {
  client: Client
  sessions: Session[]
  followUps: FollowUpEntry[]
}

export async function ClientDashboard({ client, sessions, followUps }: ClientDashboardProps) {
  const privacyClientId = await getPrivacyClientId()
  const blurred = privacyClientId !== null && client.id !== privacyClientId
  const blurClass = blurred ? "blur-sm select-none" : ""

  return (
    <div className="space-y-6 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className={`text-2xl font-bold ${blurClass}`}>{client.name}</h1>
          <p className={`text-muted-foreground ${blurClass} inline-flex items-center gap-2`}>
            {client.company}
            {!blurred && <DeleteClientDialog clientId={client.id} companyName={client.company} />}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {client.industry && <Badge variant="secondary">{client.industry}</Badge>}
            {client.contactEmail && (
              <span className="text-sm text-muted-foreground">{client.contactEmail}</span>
            )}
          </div>
        </div>
        <Button asChild className="self-start">
          <Link href={`/clients/${client.id}/sessions/new`}>New Session</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 min-w-0">
        <div className="lg:col-span-2 space-y-4 overflow-hidden">
          <h2 className="text-lg font-semibold">Sessions</h2>
          <SessionList sessions={sessions} clientId={client.id} />
        </div>
        <div className="space-y-4 overflow-hidden">
          <FollowUpPanel followUps={followUps} clientId={client.id} />
          <NeedsSummary clientId={client.id} initialNeeds={client.needsSummary} />
        </div>
      </div>
    </div>
  )
}
