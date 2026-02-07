"use client"

import { Client } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { usePrivacyMode } from "@/components/providers/privacy-mode-provider"

interface ClientHeaderProps {
  client: Client
}

export function ClientHeader({ client }: ClientHeaderProps) {
  const { isBlurred } = usePrivacyMode()
  const blurClass = isBlurred(client.id) ? "blur-sm select-none" : ""

  return (
    <div>
      <h1 className={`text-2xl font-bold ${blurClass}`}>{client.name}</h1>
      <p className={`text-muted-foreground ${blurClass}`}>{client.company}</p>
      <div className="flex gap-2 mt-2">
        {client.industry && <Badge variant="secondary">{client.industry}</Badge>}
        {client.contactEmail && (
          <span className="text-sm text-muted-foreground">{client.contactEmail}</span>
        )}
      </div>
    </div>
  )
}
