"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Client } from "@/lib/types"
import { usePrivacyMode } from "@/components/providers/privacy-mode-provider"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const { isBlurred } = usePrivacyMode()

  useEffect(() => {
    if (open) {
      fetch("/api/clients")
        .then((res) => res.json())
        .then((data) => setClients(data))
        .catch(() => {})
    }
  }, [open])

  const navigate = useCallback(
    (path: string) => {
      onOpenChange(false)
      router.push(path)
    },
    [router, onOpenChange]
  )

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search clients, navigate..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => navigate("/")}>Home</CommandItem>
          <CommandItem onSelect={() => navigate("/clients/new")}>New Client</CommandItem>
        </CommandGroup>
        {clients.length > 0 && (
          <CommandGroup heading="Clients">
            {clients.map((client) => {
              const blurred = isBlurred(client.id)
              const blurClass = blurred ? "blur-sm select-none" : ""
              return (
                <CommandItem key={client.id} onSelect={() => navigate(`/clients/${client.id}`)}>
                  <span className={blurClass}>{client.name} — {client.company}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
