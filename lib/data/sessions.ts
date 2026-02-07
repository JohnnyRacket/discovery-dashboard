import { getBlob, putBlob, delBlob, listBlobs, findBlob } from "@/lib/blob"
import { Session } from "@/lib/types"

export async function getSession(id: string): Promise<Session | null> {
  const blob = await findBlob(`sessions/${id}.json`)
  if (!blob) return null
  return getBlob<Session>(blob.url)
}

export async function getClientSessions(clientId: string): Promise<Session[]> {
  const blobs = await listBlobs("sessions/")
  if (!blobs.length) return []
  const sessions = await Promise.all(
    blobs.map((b) => getBlob<Session>(b.url))
  )
  return (sessions.filter(Boolean) as Session[])
    .filter((s) => s.clientId === clientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function createSession(session: Session): Promise<void> {
  await putBlob(`sessions/${session.id}.json`, session)
}

export async function updateSession(session: Session): Promise<void> {
  await putBlob(`sessions/${session.id}.json`, session)
}

export async function deleteSession(session: Session): Promise<void> {
  const blob = await findBlob(`sessions/${session.id}.json`)
  if (blob) await delBlob(blob.url)
}
