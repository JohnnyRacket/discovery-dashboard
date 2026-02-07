import { streamText } from "ai"
import { gateway } from "@ai-sdk/gateway"
import { getSession } from "@/lib/data/sessions"

export async function POST(request: Request) {
  const { sessionId } = await request.json()
  const session = await getSession(sessionId)

  if (!session) {
    return new Response("Session not found", { status: 404 })
  }

  // Build context from discovery items
  const context = session.discoveryItems
    .map((item) => {
      const subItems = item.subItems
        .map((sub) => `  [${sub.type}${sub.resolved ? " ✓" : ""}${sub.important ? " ⭐" : ""}] ${sub.content}`)
        .join("\n")
      return `## ${item.title}\n${subItems}`
    })
    .join("\n\n")

  const result = streamText({
    model: gateway("deepseek/deepseek-v3.2"),
    system: `You are a sales engineering assistant. Provide concise, actionable summaries of discovery sessions.`,
    prompt: `Summarize this discovery session titled "${session.title}" from ${session.date} in 2-3 sentences. Be extremely brief. Do not use markdown formatting. Plain text only. Focus on what was discussed, key findings, and any important next steps.

${context}

${session.notes ? `Session notes: ${session.notes}` : ""}`,
  })

  return result.toTextStreamResponse()
}
