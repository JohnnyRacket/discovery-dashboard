import { getBlob, putBlob, delBlob, listBlobs, findBlob } from "@/lib/blob"
import { Client } from "@/lib/types"

export async function getAllClients(): Promise<Client[]> {
  const blobs = await listBlobs("clients/")
  if (!blobs.length) return []
  const clients = await Promise.all(
    blobs.map((b) => getBlob<Client>(b.url))
  )
  return (clients.filter(Boolean) as Client[]).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export async function getClient(id: string): Promise<Client | null> {
  const blob = await findBlob(`clients/${id}.json`)
  if (!blob) return null
  return getBlob<Client>(blob.url)
}

export async function createClient(client: Client): Promise<void> {
  await putBlob(`clients/${client.id}.json`, client)
}

export async function updateClient(client: Client): Promise<void> {
  await putBlob(`clients/${client.id}.json`, client)
}

export async function deleteClient(id: string): Promise<void> {
  const blob = await findBlob(`clients/${id}.json`)
  if (blob) await delBlob(blob.url)
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
