"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { Session } from "@/lib/types"
import { saveSessionAction } from "@/lib/actions/session-actions"

export type SaveStatus = "saved" | "saving" | "unsaved" | "error"

export function useDebouncedSave(session: Session, delay: number = 1500) {
  const [status, setStatus] = useState<SaveStatus>("saved")
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedRef = useRef<string>(JSON.stringify(session))
  const sessionRef = useRef(session)
  sessionRef.current = session

  const save = useCallback(async () => {
    setStatus("saving")
    try {
      await saveSessionAction(sessionRef.current)
      lastSavedRef.current = JSON.stringify(sessionRef.current)
      setStatus("saved")
    } catch {
      setStatus("error")
    }
  }, [])

  const forceSave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    save()
  }, [save])

  useEffect(() => {
    const current = JSON.stringify(session)
    if (current === lastSavedRef.current) return

    setStatus("unsaved")
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(save, delay)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [session, delay, save])

  return { status, forceSave }
}
