"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Session } from "@/lib/types"
import { saveSessionSummary } from "@/lib/actions/session-actions"

interface SessionCardProps {
  session: Session
}

export function SessionCard({ session }: SessionCardProps) {
  const [summary, setSummary] = useState(session.summary || "")
  const [isGenerating, setIsGenerating] = useState(false)

  const itemCount = session.discoveryItems.length
  const subItemCount = session.discoveryItems.reduce((sum, item) => sum + item.subItems.length, 0)
  const followUpCount = session.discoveryItems.reduce(
    (sum, item) => sum + item.subItems.filter((s) => s.type === "follow-up" && !s.resolved).length,
    0
  )

  const handleSummarize = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsGenerating(true)
    setSummary("")

    try {
      const response = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id }),
      })

      if (!response.ok || !response.body) {
        throw new Error("Failed to generate summary")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
        setSummary(fullText)
      }

      // Persist the summary
      await saveSessionSummary(session.id, fullText)
    } catch {
      setSummary("Failed to generate summary.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="hover:border-primary/30 hover:shadow-sm transition-all">
      <Link href={`/clients/${session.clientId}/sessions/${session.id}`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base">{session.title}</CardTitle>
              <CardDescription>{session.date}</CardDescription>
            </div>
            <Badge variant={session.status === "active" ? "default" : "secondary"}>
              {session.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span>{itemCount} topics</span>
            <span>{subItemCount} items</span>
            {followUpCount > 0 && (
              <span className="text-amber-600 font-medium">{followUpCount} open follow-ups</span>
            )}
          </div>
        </CardContent>
      </Link>
      {session.status === "completed" && (
        <CardContent className="pt-0 pb-3">
          {summary ? (
            <p className="text-sm text-muted-foreground mt-1">{summary}</p>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={handleSummarize}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Summarize"}
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  )
}
