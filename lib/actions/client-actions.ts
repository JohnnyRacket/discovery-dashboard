"use server"

import { nanoid } from "nanoid"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient, getClient, updateClient, deleteClient } from "@/lib/data/clients"
import { getClientSessions, deleteSession } from "@/lib/data/sessions"
import { findBlob, delBlob } from "@/lib/blob"
import { Client } from "@/lib/types"

export async function createClientAction(formData: FormData) {
  const now = new Date().toISOString()
  const client: Client = {
    id: nanoid(),
    name: formData.get("name") as string,
    company: formData.get("company") as string,
    contactEmail: (formData.get("contactEmail") as string) || undefined,
    contactPhone: (formData.get("contactPhone") as string) || undefined,
    industry: (formData.get("industry") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
    createdAt: now,
    updatedAt: now,
  }
  await createClient(client)
  revalidatePath("/")
  redirect(`/clients/${client.id}`)
}

export async function updateClientAction(formData: FormData) {
  const id = formData.get("id") as string
  const now = new Date().toISOString()
  const client: Client = {
    id,
    name: formData.get("name") as string,
    company: formData.get("company") as string,
    contactEmail: (formData.get("contactEmail") as string) || undefined,
    contactPhone: (formData.get("contactPhone") as string) || undefined,
    industry: (formData.get("industry") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
    createdAt: formData.get("createdAt") as string,
    updatedAt: now,
  }
  await updateClient(client)
  revalidatePath(`/clients/${id}`)
  redirect(`/clients/${id}`)
}

export async function saveClientNeedsSummary(clientId: string, needs: string[]) {
  const client = await getClient(clientId)
  if (!client) throw new Error("Client not found")
  client.needsSummary = needs
  client.updatedAt = new Date().toISOString()
  await updateClient(client)
  revalidatePath(`/clients/${clientId}`)
}

export async function deleteClientAction(id: string) {
  // Delete all sessions for this client
  const sessions = await getClientSessions(id)
  await Promise.all(sessions.map((s) => deleteSession(s)))

  // Delete follow-ups blob
  const followUpBlob = await findBlob(`followups/${id}.json`)
  if (followUpBlob) await delBlob(followUpBlob.url)

  // Delete the client
  await deleteClient(id)
  revalidatePath("/")
  redirect("/")
}
