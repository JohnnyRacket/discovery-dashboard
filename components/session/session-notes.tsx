"use client"

import { Textarea } from "@/components/ui/textarea"

interface SessionNotesProps {
  notes: string
  onChange: (notes: string) => void
}

export function SessionNotes({ notes, onChange }: SessionNotesProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Session Notes</h3>
      <Textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Free-form session notes..."
        rows={4}
        className="resize-y"
      />
    </div>
  )
}
