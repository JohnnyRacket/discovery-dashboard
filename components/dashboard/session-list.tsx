"use client"

import { useMemo, useState } from "react"
import { Session } from "@/lib/types"
import { SessionCard } from "./session-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowDownUp } from "lucide-react"

interface SessionListProps {
  sessions: Session[]
  clientId: string
}

export function SessionList({ sessions, clientId }: SessionListProps) {
  const [newestFirst, setNewestFirst] = useState(true)

  const sorted = useMemo(() => {
    return [...sessions].sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime()
      return newestFirst ? -diff : diff
    })
  }, [sessions, newestFirst])

  if (sessions.length === 0) {
    return (
      <>
        <h2 className="text-lg font-semibold">Sessions</h2>
        <EmptyState
          icon="📝"
          title="No sessions yet"
          description="Start a discovery session to begin capturing notes"
          action={
            <Button asChild>
              <Link href={`/clients/${clientId}/sessions/new`}>New Session</Link>
            </Button>
          }
        />
      </>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sessions</h2>
        {sessions.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground"
            onClick={() => setNewestFirst((v) => !v)}
            title={newestFirst ? "Newest first" : "Oldest first"}
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        )}
      </div>
      {sorted.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  )
}
