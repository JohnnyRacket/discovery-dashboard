"use client"

import { Input } from "@/components/ui/input"

interface ClientSearchProps {
  value: string
  onChange: (value: string) => void
}

export function ClientSearch({ value, onChange }: ClientSearchProps) {
  return (
    <Input
      placeholder="Search clients by name, company, or industry..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-md"
    />
  )
}
