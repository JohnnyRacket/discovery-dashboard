import { getBlob, putBlob, findBlob } from "@/lib/blob"
import { Session, SubItem } from "@/lib/types"

export interface FollowUpEntry {
  clientId: string
  sessionId: string
  discoveryItemId: string
  discoveryItemTitle: string
  subItem: SubItem
}

export async function getClientFollowUps(clientId: string): Promise<FollowUpEntry[]> {
  const blob = await findBlob(`followups/${clientId}.json`)
  if (!blob) return []
  return (await getBlob<FollowUpEntry[]>(blob.url)) ?? []
}

export async function rebuildFollowUpIndex(session: Session): Promise<void> {
  const clientId = session.clientId

  // Load existing entries, keep those from other sessions
  const existing = await getClientFollowUps(clientId)
  const kept = existing.filter((e) => e.sessionId !== session.id)

  // Build new entries from this session
  const newEntries: FollowUpEntry[] = []
  for (const item of session.discoveryItems) {
    for (const sub of item.subItems) {
      if (sub.type === "follow-up" && !sub.resolved) {
        newEntries.push({
          clientId,
          sessionId: session.id,
          discoveryItemId: item.id,
          discoveryItemTitle: item.title,
          subItem: sub,
        })
      }
    }
  }

  const all = [...kept, ...newEntries].sort((a, b) => {
    const aTime = a.subItem.dueDate ? new Date(a.subItem.dueDate).getTime() : Infinity
    const bTime = b.subItem.dueDate ? new Date(b.subItem.dueDate).getTime() : Infinity
    return aTime - bTime
  })

  await putBlob(`followups/${clientId}.json`, all)
}
