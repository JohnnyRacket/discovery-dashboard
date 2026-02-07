import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Client } from "@/lib/types"

interface ClientCardProps {
  client: Client
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <Link href={`/clients/${client.id}`}>
      <Card className="hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
        <CardHeader className="pb-2">
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
        {(client.contactEmail || client.notes) && (
          <CardContent className="pt-0">
            {client.contactEmail && (
              <p className="text-xs text-muted-foreground">{client.contactEmail}</p>
            )}
            {client.notes && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{client.notes}</p>
            )}
          </CardContent>
        )}
      </Card>
    </Link>
  )
}
