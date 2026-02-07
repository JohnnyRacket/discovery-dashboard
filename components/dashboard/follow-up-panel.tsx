"use client"

import { useState, useTransition } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FollowUpEntry } from "@/lib/data/follow-ups"
import { Contact } from "@/lib/types"
import { SUB_ITEM_TYPE_CONFIG } from "@/lib/constants"
import { assignFollowUpContactAction, bulkAssignFollowUpContactsAction } from "@/lib/actions/client-actions"
import { Zap } from "lucide-react"
import Link from "next/link"

interface FollowUpPanelProps {
  followUps: FollowUpEntry[]
  clientId: string
  contacts: Contact[]
}

export function FollowUpPanel({ followUps: initialFollowUps, clientId, contacts }: FollowUpPanelProps) {
  const [followUps, setFollowUps] = useState(initialFollowUps)
  const [isPending, startTransition] = useTransition()
  const [autoAssigning, setAutoAssigning] = useState(false)

  function handleAssign(subItemId: string, contactId: string) {
    const resolved = contactId === "none" ? undefined : contactId
    setFollowUps((prev) => prev.map((e) =>
      e.subItem.id === subItemId ? { ...e, contactId: resolved } : e
    ))
    startTransition(async () => {
      await assignFollowUpContactAction(clientId, subItemId, resolved ?? null)
    })
  }

  async function handleAutoAssign() {
    if (contacts.length === 0 || followUps.length === 0) return
    setAutoAssigning(true)
    try {
      const res = await fetch("/api/ai/assign-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      })
      if (!res.ok) return
      const mapping: Record<string, string> = await res.json()
      // Update local state optimistically
      setFollowUps((prev) => prev.map((e) => {
        const assigned = mapping[e.subItem.id]
        return assigned ? { ...e, contactId: assigned } : e
      }))
      // Persist all assignments in one operation
      await bulkAssignFollowUpContactsAction(clientId, mapping)
    } finally {
      setAutoAssigning(false)
    }
  }

  const contactMap = new Map(contacts.map((c) => [c.id, c]))

  if (followUps.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Follow-ups & Action Items</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No open follow-ups</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Follow-ups & Action Items ({followUps.length})
          </CardTitle>
          {contacts.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={handleAutoAssign}
              disabled={autoAssigning || isPending}
            >
              <Zap className="h-3 w-3" />
              {autoAssigning ? "Assigning..." : "Auto-assign"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {followUps.map((entry, i) => {
          const config = SUB_ITEM_TYPE_CONFIG[entry.subItem.type]
          return (
            <div key={i} className="space-y-1">
              <Link
                href={`/clients/${clientId}/sessions/${entry.sessionId}`}
                className="block"
              >
                <div className="flex items-start gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors">
                  <span className="text-sm flex-shrink-0">{config.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{entry.subItem.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.discoveryItemTitle}
                      {entry.subItem.dueDate && (
                        <span className="ml-2">Due: {entry.subItem.dueDate}</span>
                      )}
                    </p>
                  </div>
                  <Badge variant="secondary" className={`text-xs shrink-0 ${config.color} ${config.bgColor}`}>
                    {config.label}
                  </Badge>
                </div>
              </Link>
              {contacts.length > 0 && (
                <div className="pl-7">
                  <Select
                    value={entry.contactId ?? "none"}
                    onValueChange={(val) => handleAssign(entry.subItem.id, val)}
                    disabled={isPending}
                  >
                    <SelectTrigger className="h-7 text-xs w-auto min-w-[140px]">
                      <SelectValue placeholder="Assign contact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Unassigned</SelectItem>
                      {contacts.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}{c.role ? ` (${c.role})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
