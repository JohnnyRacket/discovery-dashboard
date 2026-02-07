import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Client } from "@/lib/types"

interface ClientCardProps {
  client: Client
  blurred?: boolean
}

export function ClientCard({ client, blurred }: ClientCardProps) {
  const card = (
      <Card className={`transition-all ${blurred ? "cursor-default opacity-60" : "hover:border-primary/30 hover:shadow-sm cursor-pointer"}`}>
        <CardHeader className={`pb-2 ${blurred ? "blur select-none" : ""}`}>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base">{client.name}</CardTitle>
              <CardDescription>{client.company}</CardDescription>
            </div>
            {client.industry && (
              <Badge variant="secondary" className="text-xs">
                {client.industry}
              </Badge>
            )}
          </div>
        </CardHeader>
        {((client.contacts && client.contacts.length > 0) || client.notes) && (
          <CardContent className={`pt-0 ${blurred ? "blur select-none" : ""}`}>
            {client.contacts && client.contacts.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {client.contacts.length} contact{client.contacts.length !== 1 ? "s" : ""}
              </p>
            )}
            {client.notes && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{client.notes}</p>
            )}
          </CardContent>
        )}
      </Card>
  )

  if (blurred) return card
  return <Link href={`/clients/${client.id}`}>{card}</Link>
}
