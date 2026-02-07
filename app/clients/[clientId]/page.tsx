import { notFound } from "next/navigation"
import { getClient } from "@/lib/data/clients"
import { getClientSessions } from "@/lib/data/sessions"
import { getClientFollowUps } from "@/lib/data/follow-ups"
import { ClientDashboard } from "@/components/dashboard/client-dashboard"

export default async function ClientPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const [client, sessions, followUps] = await Promise.all([
    getClient(clientId),
    getClientSessions(clientId),
    getClientFollowUps(clientId),
  ])

  if (!client) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
      <ClientDashboard client={client} sessions={sessions} followUps={followUps} />
    </div>
  )
}
