"use server"

import { nanoid } from "nanoid"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient, getClient, updateClient, deleteClient } from "@/lib/data/clients"
import { getClientSessions, deleteSession } from "@/lib/data/sessions"
import { getClientFollowUps } from "@/lib/data/follow-ups"
import { findBlob, delBlob, putBlob } from "@/lib/blob"
import { Client, Contact } from "@/lib/types"

export async function createClientAction(formData: FormData) {
  const now = new Date().toISOString()
  const client: Client = {
    id: nanoid(),
    name: formData.get("name") as string,
    company: formData.get("company") as string,
    industry: (formData.get("industry") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
    contacts: [],
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
  const existing = await getClient(id)
  const client: Client = {
    id,
    name: formData.get("name") as string,
    company: formData.get("company") as string,
    industry: (formData.get("industry") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
    contacts: existing?.contacts ?? [],
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

export async function addContactAction(clientId: string, contact: Omit<Contact, "id" | "createdAt" | "updatedAt">) {
  const client = await getClient(clientId)
  if (!client) throw new Error("Client not found")
  const now = new Date().toISOString()
  const newContact: Contact = {
    id: nanoid(),
    ...contact,
    createdAt: now,
    updatedAt: now,
  }
  client.contacts = [...(client.contacts ?? []), newContact]
  client.updatedAt = now
  await updateClient(client)
  revalidatePath(`/clients/${clientId}`)
  return newContact
}

export async function updateContactAction(clientId: string, contactId: string, updates: Partial<Omit<Contact, "id" | "createdAt" | "updatedAt">>) {
  const client = await getClient(clientId)
  if (!client) throw new Error("Client not found")
  const now = new Date().toISOString()
  client.contacts = (client.contacts ?? []).map((c) => {
    if (c.id === contactId) {
      return { ...c, ...updates, updatedAt: now }
    }
    return c
  })
  client.updatedAt = now
  await updateClient(client)
  revalidatePath(`/clients/${clientId}`)
}

export async function deleteContactAction(clientId: string, contactId: string) {
  const client = await getClient(clientId)
  if (!client) throw new Error("Client not found")
  client.contacts = (client.contacts ?? []).filter((c) => c.id !== contactId)
  client.updatedAt = new Date().toISOString()
  await updateClient(client)
  revalidatePath(`/clients/${clientId}`)
}

export async function assignFollowUpContactAction(clientId: string, subItemId: string, contactId: string | null) {
  const followUps = await getClientFollowUps(clientId)
  const updated = followUps.map((entry) => {
    if (entry.subItem.id === subItemId) {
      return { ...entry, contactId: contactId ?? undefined }
    }
    return entry
  })
  await putBlob(`followups/${clientId}.json`, updated)
  revalidatePath(`/clients/${clientId}`)
}

export async function bulkAssignFollowUpContactsAction(clientId: string, mapping: Record<string, string>) {
  const followUps = await getClientFollowUps(clientId)
  const updated = followUps.map((entry) => {
    const contactId = mapping[entry.subItem.id]
    if (contactId !== undefined) {
      return { ...entry, contactId }
    }
    return entry
  })
  await putBlob(`followups/${clientId}.json`, updated)
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
