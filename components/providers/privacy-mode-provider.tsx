"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"

interface PrivacyModeContextValue {
  privacyClientId: string | null
  setPrivacyClientId: (id: string) => void
  clearPrivacy: () => void
  isBlurred: (clientId: string) => boolean
}

const PrivacyModeContext = createContext<PrivacyModeContextValue | null>(null)

const STORAGE_KEY = "privacy-client-id"

export function PrivacyModeProvider({ children }: { children: React.ReactNode }) {
  const [privacyClientId, setPrivacyClientIdState] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setPrivacyClientIdState(stored)
    }
    setHydrated(true)
  }, [])

  const setPrivacyClientId = useCallback((id: string) => {
    setPrivacyClientIdState(id)
    localStorage.setItem(STORAGE_KEY, id)
  }, [])

  const clearPrivacy = useCallback(() => {
    setPrivacyClientIdState(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const isBlurred = useCallback(
    (clientId: string) => {
      if (!hydrated) return false
      return privacyClientId !== null && clientId !== privacyClientId
    },
    [privacyClientId, hydrated]
  )

  const value = useMemo(
    () => ({ privacyClientId, setPrivacyClientId, clearPrivacy, isBlurred }),
    [privacyClientId, setPrivacyClientId, clearPrivacy, isBlurred]
  )

  return (
    <PrivacyModeContext.Provider value={value}>
      {children}
    </PrivacyModeContext.Provider>
  )
}

export function usePrivacyMode() {
  const ctx = useContext(PrivacyModeContext)
  if (!ctx) throw new Error("usePrivacyMode must be used within PrivacyModeProvider")
  return ctx
}
