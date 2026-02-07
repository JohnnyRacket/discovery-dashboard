"use client"

import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { deleteClientAction } from "@/lib/actions/client-actions"

interface DeleteClientDialogProps {
  clientId: string
  companyName: string
}

export function DeleteClientDialog({ clientId, companyName }: DeleteClientDialogProps) {
  const [open, setOpen] = useState(false)
  const [confirmation, setConfirmation] = useState("")
  const [isPending, startTransition] = useTransition()

  const isMatch = confirmation.toLowerCase() === companyName.toLowerCase()

  function handleConfirm() {
    startTransition(async () => {
      await deleteClientAction(clientId)
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setConfirmation("") }}>
      <DialogTrigger asChild>
        <button type="button" className="text-muted-foreground/50 hover:text-destructive transition-colors" aria-label="Delete client">
          <Trash2 className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Client</DialogTitle>
          <DialogDescription>
            This will permanently delete this client along with all sessions and data. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <label htmlFor="confirm-delete" className="text-sm font-medium">
            Type <span className="font-semibold">{companyName}</span> to confirm
          </label>
          <Input
            id="confirm-delete"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder={companyName}
            autoComplete="off"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={!isMatch || isPending}>
            {isPending ? "Deleting..." : "Delete Client"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
