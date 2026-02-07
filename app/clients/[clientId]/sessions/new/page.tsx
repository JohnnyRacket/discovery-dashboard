import { notFound } from "next/navigation"
import { getClient } from "@/lib/data/clients"
import { createSessionAction } from "@/lib/actions/session-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default async function NewSessionPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params
  const client = await getClient(clientId)
  if (!client) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>New Session for {client.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createSessionAction} className="space-y-4">
            <input type="hidden" name="clientId" value={clientId} />
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Session Title *</label>
              <Input
                id="title"
                name="title"
                required
                placeholder="e.g. Initial Discovery, Technical Deep-Dive"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">Date</label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit">Start Session</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
