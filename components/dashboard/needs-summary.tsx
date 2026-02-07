"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { saveClientNeedsSummary } from "@/lib/actions/client-actions"

interface NeedsSummaryProps {
  clientId: string
  initialNeeds?: string[]
}

export function NeedsSummary({ clientId, initialNeeds }: NeedsSummaryProps) {
  const [needs, setNeeds] = useState<string[]>(initialNeeds ?? [])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    setIsGenerating(true)
    setNeeds([])
    setError("")

    try {
      const response = await fetch("/api/ai/client-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      })

      if (!response.ok) {
        if (response.status === 404) {
          setError("No completed sessions to summarize yet.")
          return
        }
        throw new Error("Failed to generate summary")
      }

      const result: string[] = await response.json()
      setNeeds(result)
      await saveClientNeedsSummary(clientId, result)
    } catch {
      setError("Failed to generate summary.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-medium shrink-0">Client Summary</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : needs.length > 0 ? "Regenerate" : "Generate"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-sm text-muted-foreground">{error}</p>
        ) : needs.length > 0 ? (
          <ul className="text-sm space-y-1 list-disc list-inside">
            {needs.map((need, i) => (
              <li key={i}>{need}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Generate a summary of key pain points and needs from completed sessions.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
