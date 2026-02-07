"use server"

import { nanoid } from "nanoid"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createSession, updateSession } from "@/lib/data/sessions"
import { rebuildFollowUpIndex } from "@/lib/data/follow-ups"
import { Session } from "@/lib/types"

export async function createSessionAction(formData: FormData) {
  const clientId = formData.get("clientId") as string
  const now = new Date().toISOString()
  const session: Session = {
    id: nanoid(),
    clientId,
    date: (formData.get("date") as string) || new Date().toISOString().slice(0, 10),
    title: formData.get("title") as string,
    discoveryItems: [],
    notes: "",
    status: "active",
    createdAt: now,
    updatedAt: now,
  }
  await createSession(session)
  revalidatePath(`/clients/${clientId}`)
  redirect(`/clients/${clientId}/sessions/${session.id}`)
}

export async function saveSessionAction(session: Session) {
  session.updatedAt = new Date().toISOString()
  await updateSession(session)
  await rebuildFollowUpIndex(session)
  revalidatePath(`/clients/${session.clientId}/sessions/${session.id}`)
  return { success: true }
}

export async function saveSessionSummary(sessionId: string, summary: string) {
  const { getSession } = await import("@/lib/data/sessions")
  const session = await getSession(sessionId)
  if (!session) return
  session.summary = summary
  session.updatedAt = new Date().toISOString()
  await updateSession(session)
  revalidatePath(`/clients/${session.clientId}`)
}

export async function completeSessionAction(sessionId: string, clientId: string) {
  const { getSession } = await import("@/lib/data/sessions")
  const session = await getSession(sessionId)
  if (!session) return
  session.status = "completed"
  session.updatedAt = new Date().toISOString()
  await updateSession(session)
  await rebuildFollowUpIndex(session)
  revalidatePath(`/clients/${clientId}`)
}
