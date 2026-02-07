import { redis } from "@/lib/redis"
import { Session } from "@/lib/types"

const sessionKey = (id: string) => `session:${id}`
const clientSessionsKey = (clientId: string) => `client:${clientId}:sessions`

export async function getSession(id: string): Promise<Session | null> {
  return redis.get<Session>(sessionKey(id))
}

export async function getClientSessions(clientId: string): Promise<Session[]> {
  const ids = await redis.zrange(clientSessionsKey(clientId), 0, -1, { rev: true })
  if (!ids.length) return []
  const pipeline = redis.pipeline()
  for (const id of ids) {
    pipeline.get(sessionKey(id as string))
  }
  const results = await pipeline.exec()
  return results.filter(Boolean) as Session[]
}

export async function createSession(session: Session): Promise<void> {
  const pipeline = redis.pipeline()
  pipeline.set(sessionKey(session.id), JSON.stringify(session))
  pipeline.zadd(clientSessionsKey(session.clientId), {
    score: new Date(session.date).getTime(),
    member: session.id,
  })
  await pipeline.exec()
}

export async function updateSession(session: Session): Promise<void> {
  await redis.set(sessionKey(session.id), JSON.stringify(session))
}

export async function deleteSession(session: Session): Promise<void> {
  const pipeline = redis.pipeline()
  pipeline.del(sessionKey(session.id))
  pipeline.zrem(clientSessionsKey(session.clientId), session.id)
  await pipeline.exec()
}
