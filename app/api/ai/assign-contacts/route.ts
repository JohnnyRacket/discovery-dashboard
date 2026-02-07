import { generateText } from "ai"
import { gateway } from "@ai-sdk/gateway"
import { getClient } from "@/lib/data/clients"
import { getClientFollowUps } from "@/lib/data/follow-ups"

export async function POST(request: Request) {
  const { clientId } = await request.json()

  const client = await getClient(clientId)
  if (!client) {
    return new Response("Client not found", { status: 404 })
  }

  const contacts = client.contacts ?? []
  if (contacts.length === 0) {
    return Response.json({})
  }

  const followUps = await getClientFollowUps(clientId)
  if (followUps.length === 0) {
    return Response.json({})
  }

  const contactList = contacts
    .map((c) => `- ID: ${c.id}, Name: ${c.name}${c.role ? `, Role: ${c.role}` : ""}`)
    .join("\n")

  const followUpList = followUps
    .map((f) => `- SubItem ID: ${f.subItem.id}, Topic: "${f.discoveryItemTitle}", Content: "${f.subItem.content}"`)
    .join("\n")

  const { text } = await generateText({
    model: gateway("deepseek/deepseek-v3.2"),
    system: `You are an assistant that matches follow-up items to the most appropriate contact person. Return ONLY valid JSON with no explanation.`,
    prompt: `Given these contacts:
${contactList}

And these follow-up items:
${followUpList}

Return a JSON object mapping subItem IDs to contact IDs for the best matches. Only include mappings where there is reasonable confidence based on the contact's role matching the follow-up topic/content. Skip ambiguous ones.

Example format: {"subItemId1": "contactId1", "subItemId2": "contactId2"}

Return only the JSON object, nothing else.`,
  })

  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim()
    const mapping = JSON.parse(cleaned)
    // Validate that all IDs actually exist
    const validContactIds = new Set(contacts.map((c) => c.id))
    const validSubItemIds = new Set(followUps.map((f) => f.subItem.id))
    const validated: Record<string, string> = {}
    for (const [subItemId, contactId] of Object.entries(mapping)) {
      if (validSubItemIds.has(subItemId) && validContactIds.has(contactId as string)) {
        validated[subItemId] = contactId as string
      }
    }
    return Response.json(validated)
  } catch {
    return Response.json({})
  }
}
