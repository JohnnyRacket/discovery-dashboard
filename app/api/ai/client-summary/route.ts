import { generateText } from "ai"
import { gateway } from "@ai-sdk/gateway"
import { getClientSessions } from "@/lib/data/sessions"

export async function POST(request: Request) {
  const { clientId } = await request.json()
  const sessions = await getClientSessions(clientId)
  const completedSessions = sessions.filter((s) => s.status === "completed")

  if (completedSessions.length === 0) {
    return new Response("No completed sessions found", { status: 404 })
  }

  // Build combined context from all completed sessions
  const context = completedSessions
    .map((session) => {
      const items = session.discoveryItems
        .map((item) => {
          const subItems = item.subItems
            .map((sub) => `  [${sub.type}${sub.important ? " ⭐" : ""}] ${sub.content}`)
            .join("\n")
          return `### ${item.title}\n${subItems}`
        })
        .join("\n")
      return `## Session: ${session.title} (${session.date})\n${items}`
    })
    .join("\n\n")

  const result = await generateText({
    model: gateway("deepseek/deepseek-v3.2"),
    system: `You are a sales engineering assistant. Analyze discovery session data and identify key client needs. Return ONLY a JSON array of strings. No markdown, no headers, no explanation. Each string is one key need, 1 sentence max.`,
    prompt: `Based on these ${completedSessions.length} completed discovery sessions, identify the client's key needs and requirements. Deduplicate and prioritize by importance/frequency.

${context}

Return ONLY a JSON array of strings. Example: ["Need 1", "Need 2", "Need 3"]`,
  })

  let needs: string[]
  try {
    needs = JSON.parse(result.text)
  } catch {
    // If the model wraps in markdown code fences, strip them
    const cleaned = result.text.replace(/```json?\n?/g, "").replace(/```/g, "").trim()
    needs = JSON.parse(cleaned)
  }

  return Response.json(needs)
}
