"use client"

import { createContext, useContext, useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"

interface PrivacyModeContextValue {
  privacyClientId: string | null
  setPrivacyClientId: (id: string) => void
  clearPrivacy: () => void
  isBlurred: (clientId: string) => boolean
}

const PrivacyModeContext = createContext<PrivacyModeContextValue | null>(null)

const COOKIE_NAME = "privacy-client-id"

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`
}

interface PrivacyModeProviderProps {
  children: React.ReactNode
  initialClientId?: string | null
}

export function PrivacyModeProvider({ children, initialClientId = null }: PrivacyModeProviderProps) {
  const router = useRouter()
  const [privacyClientId, setPrivacyClientIdState] = useState<string | null>(initialClientId)

  const setPrivacyClientId = useCallback((id: string) => {
    setPrivacyClientIdState(id)
    setCookie(COOKIE_NAME, id)
    router.refresh()
  }, [router])

  const clearPrivacy = useCallback(() => {
    setPrivacyClientIdState(null)
    deleteCookie(COOKIE_NAME)
    router.refresh()
  }, [router])

  const isBlurred = useCallback(
    (clientId: string) => {
      return privacyClientId !== null && clientId !== privacyClientId
    },
    [privacyClientId]
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
