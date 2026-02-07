import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Client } from "@/lib/types"

interface ClientCardProps {
  client: Client
  blurred?: boolean
}

export function ClientCard({ client, blurred }: ClientCardProps) {
  const blurClass = blurred ? "blur-sm select-none" : ""
  return (
    <Link href={`/clients/${client.id}`}>
      <Card className="hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className={`text-base ${blurClass}`}>{client.name}</CardTitle>
              <CardDescription className={blurClass}>{client.company}</CardDescription>
            </div>
            {client.industry && (
              <Badge variant="secondary" className="text-xs">
                {client.industry}
              </Badge>
            )}
          </div>
        </CardHeader>
        {((client.contacts && client.contacts.length > 0) || client.notes) && (
          <CardContent className="pt-0">
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
    </Link>
  )
}
