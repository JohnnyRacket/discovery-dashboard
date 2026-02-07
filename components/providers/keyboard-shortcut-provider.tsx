"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { KeyboardShortcutHelp } from "@/components/shared/keyboard-shortcut-help"

interface KeyboardShortcutContextValue {
  showHelp: boolean
  setShowHelp: (show: boolean) => void
  showCommandPalette: boolean
  setShowCommandPalette: (show: boolean) => void
}

const KeyboardShortcutContext = createContext<KeyboardShortcutContextValue | null>(null)

export function useKeyboardShortcutContext() {
  const ctx = useContext(KeyboardShortcutContext)
  if (!ctx) throw new Error("useKeyboardShortcutContext must be used within KeyboardShortcutProvider")
  return ctx
}

export function KeyboardShortcutProvider({ children }: { children: ReactNode }) {
  const [showHelp, setShowHelp] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)

  return (
    <KeyboardShortcutContext.Provider value={{ showHelp, setShowHelp, showCommandPalette, setShowCommandPalette }}>
      {children}
      <KeyboardShortcutHelp open={showHelp} onOpenChange={setShowHelp} />
    </KeyboardShortcutContext.Provider>
  )
}
