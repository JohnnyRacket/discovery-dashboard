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
    model: gateway("anthropic/claude-sonnet-4-5-20250929"),
    system: `You are a sales engineering assistant. Analyze discovery call notes and provide a structured summary. Be concise and actionable.`,
    prompt: `Summarize this discovery session titled "${session.title}" from ${session.date}:

${context}

${session.notes ? `Session notes: ${session.notes}` : ""}

Provide:
1. **Key Focus Areas** - The main topics and concerns discussed
2. **Action Items** - Specific follow-ups needed with owners if mentioned
3. **Requirements** - Any stated requirements or constraints
4. **Risks & Objections** - Any concerns raised
5. **Next Steps** - Recommended next actions

Keep each section brief (2-4 bullet points max).`,
  })

  return result.toTextStreamResponse()
}
