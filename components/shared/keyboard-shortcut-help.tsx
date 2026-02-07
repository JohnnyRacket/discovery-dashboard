"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface KeyboardShortcutHelpProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const sessionShortcuts = [
  { keys: "Tab", action: "Cycle sub-item type forward" },
  { keys: "Shift+Tab", action: "Cycle sub-item type backward" },
  { keys: "Enter", action: "Confirm sub-item, start new one" },
  { keys: "Shift+Enter", action: "Newline within sub-item" },
  { keys: "⌘+Enter", action: "Confirm and move to next discovery item" },
  { keys: "Alt+N / ⌘+N", action: "Add new discovery item" },
  { keys: "↑ / ↓", action: "Navigate between sub-items" },
  { keys: "← / →", action: "Jump between discovery items" },
  { keys: "⌘+D", action: "Toggle resolved" },
  { keys: "⌘+I", action: "Toggle important" },
  { keys: "⌘+Backspace", action: "Delete sub-item" },
  { keys: "⌘+Shift+F", action: "Quick-add follow-up" },
  { keys: "⌘+Shift+A", action: "Quick-add action-item" },
  { keys: "Alt+1..7", action: "Jump to sub-item type" },
  { keys: "⌘+[ / ⌘+]", action: "Collapse/expand discovery item" },
]

const globalShortcuts = [
  { keys: "⌘+K", action: "Command palette" },
  { keys: "⌘+S", action: "Save session" },
  { keys: "?", action: "Show this help" },
]

export function KeyboardShortcutHelp({ open, onOpenChange }: KeyboardShortcutHelpProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Global</h3>
            <div className="space-y-1">
              {globalShortcuts.map((s) => (
                <ShortcutRow key={s.keys} keys={s.keys} action={s.action} />
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Session Data Entry</h3>
            <div className="space-y-1">
              {sessionShortcuts.map((s) => (
                <ShortcutRow key={s.keys} keys={s.keys} action={s.action} />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ShortcutRow({ keys, action }: { keys: string; action: string }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-muted-foreground">{action}</span>
      <kbd className="inline-flex items-center gap-1 rounded border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
        {keys}
      </kbd>
    </div>
  )
}
