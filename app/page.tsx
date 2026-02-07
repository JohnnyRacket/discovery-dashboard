import { getAllClients } from "@/lib/data/clients"
import { getPrivacyClientId } from "@/lib/privacy"
import { ClientList } from "@/components/clients/client-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function HomePage() {
  const [clients, privacyClientId] = await Promise.all([
    getAllClients(),
    getPrivacyClientId(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage discovery sessions and track follow-ups
          </p>
        </div>
        <Button asChild>
          <Link href="/clients/new">Add Client</Link>
        </Button>
      </div>
      <ClientList clients={clients} privacyClientId={privacyClientId} />
    </div>
  )
}
