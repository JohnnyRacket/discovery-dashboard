"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Breadcrumbs } from "./breadcrumbs"
import { CommandPalette } from "@/components/shared/command-palette"
import { useKeyboardShortcutContext } from "@/components/providers/keyboard-shortcut-provider"
import { usePrivacyMode } from "@/components/providers/privacy-mode-provider"
import { useEffect } from "react"

export function AppHeader() {
  const { setShowHelp, showCommandPalette, setShowCommandPalette } = useKeyboardShortcutContext()
  const pathname = usePathname()
  const { privacyClientId, setPrivacyClientId, clearPrivacy } = usePrivacyMode()

  const clientIdFromPath = pathname.match(/^\/clients\/([^/]+)/)?.[1] ?? null
  const showPrivacyToggle = clientIdFromPath !== null || privacyClientId !== null

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "?" && !isInputFocused()) {
        e.preventDefault()
        setShowHelp(true)
      }
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setShowCommandPalette(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setShowHelp, setShowCommandPalette])

  return (
    <>
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link href="/" className="font-semibold text-lg text-primary shrink-0">
              Discovery
            </Link>
            <Breadcrumbs />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {showPrivacyToggle && (
              <div className="flex items-center gap-1.5 mr-2">
                <Switch
                  id="privacy-mode"
                  checked={privacyClientId !== null}
                  onCheckedChange={(checked) => {
                    if (checked && clientIdFromPath) {
                      setPrivacyClientId(clientIdFromPath)
                    } else {
                      clearPrivacy()
                    }
                  }}
                  aria-label="Privacy mode"
                />
                <label htmlFor="privacy-mode" className="hidden sm:inline text-xs text-muted-foreground cursor-pointer select-none">
                  Privacy
                </label>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground text-xs gap-2"
              onClick={() => setShowCommandPalette(true)}
            >
              <span className="hidden sm:inline">Search</span>
              <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground text-xs"
              onClick={() => setShowHelp(true)}
            >
              <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                ?
              </kbd>
              <span className="sm:hidden">?</span>
            </Button>
          </div>
        </div>
      </header>
      <CommandPalette open={showCommandPalette} onOpenChange={setShowCommandPalette} />
    </>
  )
}

function isInputFocused() {
  const el = document.activeElement
  if (!el) return false
  const tag = el.tagName.toLowerCase()
  return tag === "input" || tag === "textarea" || (el as HTMLElement).isContentEditable
}
