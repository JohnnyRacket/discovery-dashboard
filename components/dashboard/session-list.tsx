import { Session } from "@/lib/types"
import { SessionCard } from "./session-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SessionListProps {
  sessions: Session[]
  clientId: string
}

export function SessionList({ sessions, clientId }: SessionListProps) {
  if (sessions.length === 0) {
    return (
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
    )
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  )
}
