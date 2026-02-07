"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientAction } from "@/lib/actions/client-actions"

export function ClientForm() {
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>New Client</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createClientAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name *</label>
            <Input id="name" name="name" required placeholder="Contact name" />
          </div>
          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium">Company *</label>
            <Input id="company" name="company" required placeholder="Company name" />
          </div>
          <div className="space-y-2">
            <label htmlFor="industry" className="text-sm font-medium">Industry</label>
            <Input id="industry" name="industry" placeholder="e.g. Healthcare, Finance" />
          </div>
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">Notes</label>
            <Textarea id="notes" name="notes" placeholder="Initial notes about this client..." rows={3} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit">Create Client</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
