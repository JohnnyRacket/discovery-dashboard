"use client"

import { Session } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SaveStatus } from "@/lib/hooks/use-debounced-save"

interface SessionHeaderProps {
  session: Session
  saveStatus: SaveStatus
  onSave: () => void
  onComplete: () => void
}

const statusConfig: Record<SaveStatus, { label: string; className: string }> = {
  saved: { label: "Saved", className: "text-green-600 bg-green-50" },
  saving: { label: "Saving...", className: "text-amber-600 bg-amber-50" },
  unsaved: { label: "Unsaved changes", className: "text-amber-600 bg-amber-50" },
  error: { label: "Save error", className: "text-red-600 bg-red-50" },
}

export function SessionHeader({ session, saveStatus, onSave, onComplete }: SessionHeaderProps) {
  const statusInfo = statusConfig[saveStatus]

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b">
      <div>
        <h1 className="text-xl font-bold">{session.title}</h1>
        <p className="text-sm text-muted-foreground">{session.date}</p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className={`text-xs ${statusInfo.className}`}>
          {statusInfo.label}
        </Badge>
        <Badge variant={session.status === "active" ? "default" : "secondary"}>
          {session.status}
        </Badge>
        {session.status === "active" && (
          <Button variant="outline" size="sm" onClick={onComplete}>
            Complete Session
          </Button>
        )}
        <Button size="sm" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  )
}
