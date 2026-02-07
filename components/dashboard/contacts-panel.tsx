"use client"

import { useState, useTransition } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Contact } from "@/lib/types"
import { addContactAction, updateContactAction, deleteContactAction } from "@/lib/actions/client-actions"
import { Plus, Trash2, Pencil, Search } from "lucide-react"

interface ContactsPanelProps {
  clientId: string
  contacts: Contact[]
}

function extractContact(formData: FormData) {
  return {
    name: (formData.get("name") as string).trim(),
    role: (formData.get("role") as string)?.trim() || undefined,
    email: (formData.get("email") as string)?.trim() || undefined,
    phone: (formData.get("phone") as string)?.trim() || undefined,
    notes: (formData.get("notes") as string)?.trim() || undefined,
  }
}

export function ContactsPanel({ clientId, contacts: initialContacts }: ContactsPanelProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [addOpen, setAddOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [editContact, setEditContact] = useState<Contact | null>(null)
  const [isPending, startTransition] = useTransition()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  function handleAddOpen(open: boolean) {
    setAddOpen(open)
    if (open) setFormKey((k) => k + 1)
  }

  function handleAdd(formData: FormData) {
    const fields = extractContact(formData)
    if (!fields.name) return
    startTransition(async () => {
      const newContact = await addContactAction(clientId, fields)
      setContacts((prev) => [...prev, newContact])
      setAddOpen(false)
    })
  }

  function handleEdit(formData: FormData) {
    if (!editContact) return
    const fields = extractContact(formData)
    if (!fields.name) return
    const updatedContact = { ...editContact, ...fields, updatedAt: new Date().toISOString() }
    setContacts((prev) => prev.map((c) => (c.id === editContact.id ? updatedContact : c)))
    setEditContact(null)
    startTransition(async () => {
      await updateContactAction(clientId, editContact.id, fields)
    })
  }

  function handleDelete(contactId: string) {
    setContacts((prev) => prev.filter((c) => c.id !== contactId))
    setDeleteConfirm(null)
    startTransition(async () => {
      await deleteContactAction(clientId, contactId)
    })
  }

  const q = search.toLowerCase()
  const filtered = q
    ? contacts.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.role?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
      )
    : contacts

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Contacts{contacts.length > 0 && ` (${contacts.length})`}
          </CardTitle>
          <Dialog open={addOpen} onOpenChange={handleAddOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Contact</DialogTitle>
                <DialogDescription>Add a new contact for this client.</DialogDescription>
              </DialogHeader>
              <form action={handleAdd} key={formKey} className="space-y-3">
                <ContactFormFields />
                <DialogFooter>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Adding..." : "Add Contact"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No contacts yet</p>
        ) : (
          <>
            {contacts.length > 3 && (
              <div className="relative mb-2">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-7 text-xs pl-7"
                />
              </div>
            )}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-xs text-muted-foreground">No matches</p>
              ) : (
                filtered.map((contact) => (
                  <div key={contact.id} className="flex items-start gap-2 p-2 rounded-md border text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{contact.name}</p>
                      {contact.role && (
                        <p className="text-xs text-muted-foreground">{contact.role}</p>
                      )}
                      {contact.email && (
                        <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
                      )}
                      {contact.phone && (
                        <p className="text-xs text-muted-foreground">{contact.phone}</p>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={() => setEditContact(contact)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      {deleteConfirm === contact.id ? (
                        <>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDelete(contact.id)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            x
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteConfirm(contact.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </CardContent>

      <Dialog open={editContact !== null} onOpenChange={(open) => !open && setEditContact(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>Update contact information.</DialogDescription>
          </DialogHeader>
          {editContact && (
            <form action={handleEdit} key={editContact.id} className="space-y-3">
              <ContactFormFields contact={editContact} />
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function ContactFormFields({ contact }: { contact?: Contact }) {
  return (
    <>
      <div className="space-y-1">
        <label htmlFor="contact-name" className="text-sm font-medium">Name *</label>
        <Input id="contact-name" name="name" required placeholder="Contact name" defaultValue={contact?.name} />
      </div>
      <div className="space-y-1">
        <label htmlFor="contact-role" className="text-sm font-medium">Role</label>
        <Input id="contact-role" name="role" placeholder="e.g. VP Engineering" defaultValue={contact?.role} />
      </div>
      <div className="space-y-1">
        <label htmlFor="contact-email" className="text-sm font-medium">Email</label>
        <Input id="contact-email" name="email" type="email" placeholder="email@company.com" defaultValue={contact?.email} />
      </div>
      <div className="space-y-1">
        <label htmlFor="contact-phone" className="text-sm font-medium">Phone</label>
        <Input id="contact-phone" name="phone" placeholder="+1 (555) 000-0000" defaultValue={contact?.phone} />
      </div>
      <div className="space-y-1">
        <label htmlFor="contact-notes" className="text-sm font-medium">Notes</label>
        <Input id="contact-notes" name="notes" placeholder="Optional notes" defaultValue={contact?.notes} />
      </div>
    </>
  )
}
