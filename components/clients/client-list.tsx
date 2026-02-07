"use client"

import { useState, useMemo } from "react"
import { Client } from "@/lib/types"
import { ClientSearch } from "./client-search"
import { ClientCard } from "./client-card"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ClientListProps {
  clients: Client[]
  privacyClientId: string | null
}

export function ClientList({ clients, privacyClientId }: ClientListProps) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    if (!search) return clients
    const q = search.toLowerCase()
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        (c.industry && c.industry.toLowerCase().includes(q))
    )
  }, [clients, search])

  return (
    <div className="space-y-4">
      <ClientSearch value={search} onChange={setSearch} />
      {filtered.length === 0 ? (
        <EmptyState
          icon="👥"
          title={search ? "No clients match your search" : "No clients yet"}
          description={search ? "Try a different search term" : "Create your first client to get started"}
          action={
            !search ? (
              <Button asChild>
                <Link href="/clients/new">Add Client</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              blurred={privacyClientId !== null && client.id !== privacyClientId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
