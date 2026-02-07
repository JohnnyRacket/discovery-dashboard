import { notFound } from "next/navigation"
import { getSession } from "@/lib/data/sessions"
import { getClient } from "@/lib/data/clients"
import { SessionDetail } from "@/components/session/session-detail"

export default async function SessionPage({
  params,
}: {
  params: Promise<{ clientId: string; sessionId: string }>
}) {
  const { clientId, sessionId } = await params
  const [session, client] = await Promise.all([getSession(sessionId), getClient(clientId)])

  if (!session || !client) notFound()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SessionDetail initialSession={session} />
    </div>
  )
}
