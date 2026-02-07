import { redis } from "@/lib/redis"
import { Session, SubItem } from "@/lib/types"

const followupsKey = (clientId: string) => `followups:${clientId}`

export interface FollowUpEntry {
  clientId: string
  sessionId: string
  discoveryItemId: string
  discoveryItemTitle: string
  subItem: SubItem
}

export async function getClientFollowUps(clientId: string): Promise<FollowUpEntry[]> {
  const entries = await redis.zrange(followupsKey(clientId), 0, -1, { rev: true })
  return (entries as unknown as FollowUpEntry[]) || []
}

export async function rebuildFollowUpIndex(session: Session): Promise<void> {
  const key = followupsKey(session.clientId)

  // Remove old entries for this session
  const existing = await redis.zrange(key, 0, -1) as string[]
  const toRemove = existing.filter((e) => {
    try {
      const parsed = typeof e === "string" ? JSON.parse(e) : e
      return parsed.sessionId === session.id
    } catch {
      return false
    }
  })
  if (toRemove.length) {
    const pipeline = redis.pipeline()
    for (const entry of toRemove) {
      pipeline.zrem(key, entry)
    }
    await pipeline.exec()
  }

  // Add current follow-ups and action-items
  const pipeline = redis.pipeline()
  for (const item of session.discoveryItems) {
    for (const sub of item.subItems) {
      if ((sub.type === "follow-up" || sub.type === "action-item") && !sub.resolved) {
        const entry: FollowUpEntry = {
          clientId: session.clientId,
          sessionId: session.id,
          discoveryItemId: item.id,
          discoveryItemTitle: item.title,
          subItem: sub,
        }
        const score = sub.dueDate ? new Date(sub.dueDate).getTime() : Date.now()
        pipeline.zadd(key, { score, member: JSON.stringify(entry) })
      }
    }
  }
  await pipeline.exec()
}
