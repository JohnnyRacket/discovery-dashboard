import { redis } from "@/lib/redis"
import { Client } from "@/lib/types"

const CLIENTS_KEY = "clients"
const clientKey = (id: string) => `client:${id}`

export async function getAllClients(): Promise<Client[]> {
  const ids = await redis.zrange(CLIENTS_KEY, 0, -1, { rev: true })
  if (!ids.length) return []
  const pipeline = redis.pipeline()
  for (const id of ids) {
    pipeline.get(clientKey(id as string))
  }
  const results = await pipeline.exec()
  return results.filter(Boolean) as Client[]
}

export async function getClient(id: string): Promise<Client | null> {
  return redis.get<Client>(clientKey(id))
}

export async function createClient(client: Client): Promise<void> {
  const pipeline = redis.pipeline()
  pipeline.set(clientKey(client.id), JSON.stringify(client))
  pipeline.zadd(CLIENTS_KEY, { score: Date.now(), member: client.id })
  await pipeline.exec()
}

export async function updateClient(client: Client): Promise<void> {
  const pipeline = redis.pipeline()
  pipeline.set(clientKey(client.id), JSON.stringify(client))
  pipeline.zadd(CLIENTS_KEY, { score: Date.now(), member: client.id })
  await pipeline.exec()
}

export async function deleteClient(id: string): Promise<void> {
  const pipeline = redis.pipeline()
  pipeline.del(clientKey(id))
  pipeline.zrem(CLIENTS_KEY, id)
  await pipeline.exec()
}

export async function searchClients(query: string): Promise<Client[]> {
  const all = await getAllClients()
  if (!query) return all
  const q = query.toLowerCase()
  return all.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      (c.industry && c.industry.toLowerCase().includes(q))
  )
}
