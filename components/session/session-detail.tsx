"use client"

import { useReducer, useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Session, SubItemType } from "@/lib/types"
import { sessionReducer, SessionAction } from "./session-reducer"
import { DiscoveryItemCard } from "./discovery-item"
import { SessionHeader } from "./session-header"
import { SessionNotes } from "./session-notes"
import { Button } from "@/components/ui/button"
import { useDebouncedSave } from "@/lib/hooks/use-debounced-save"
import { completeSessionAction } from "@/lib/actions/session-actions"

interface SessionDetailProps {
  initialSession: Session
}

export function SessionDetail({ initialSession }: SessionDetailProps) {
  const router = useRouter()
  const [session, dispatch] = useReducer(sessionReducer, initialSession)
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const [activeSubItemId, setActiveSubItemId] = useState<string | null>(null)
  const [focusTitleItemId, setFocusTitleItemId] = useState<string | null>(null)
  const [focusKey, setFocusKey] = useState(0)
  const { status, forceSave } = useDebouncedSave(session)

  const setActive = useCallback((itemId: string, subItemId: string | null) => {
    setActiveItemId(itemId)
    setActiveSubItemId(subItemId)
    setFocusTitleItemId(null)
    setFocusKey((k) => k + 1)
  }, [])

  // When a new sub-item is added, focus it
  useEffect(() => {
    if (activeItemId) {
      const item = session.discoveryItems.find((i) => i.id === activeItemId)
      if (item && item.subItems.length > 0) {
        const lastSub = item.subItems[item.subItems.length - 1]
        if (lastSub.content === "" && activeSubItemId !== lastSub.id) {
          setActiveSubItemId(lastSub.id)
          setFocusKey((k) => k + 1)
        }
      }
    }
  }, [session.discoveryItems, activeItemId, activeSubItemId])

  const handleNavigateUp = useCallback(
    (itemId: string, subItemIndex: number) => {
      const item = session.discoveryItems.find((i) => i.id === itemId)
      if (!item) return
      if (subItemIndex > 0) {
        setActive(itemId, item.subItems[subItemIndex - 1].id)
      } else {
        // Go to previous discovery item's last sub-item
        const itemIdx = session.discoveryItems.findIndex((i) => i.id === itemId)
        if (itemIdx > 0) {
          const prevItem = session.discoveryItems[itemIdx - 1]
          if (prevItem.subItems.length > 0) {
            setActive(prevItem.id, prevItem.subItems[prevItem.subItems.length - 1].id)
          }
        }
      }
    },
    [session.discoveryItems, setActive]
  )

  const handleNavigateDown = useCallback(
    (itemId: string, subItemIndex: number) => {
      const item = session.discoveryItems.find((i) => i.id === itemId)
      if (!item) return
      if (subItemIndex < item.subItems.length - 1) {
        setActive(itemId, item.subItems[subItemIndex + 1].id)
      } else {
        // Go to next discovery item's first sub-item
        const itemIdx = session.discoveryItems.findIndex((i) => i.id === itemId)
        if (itemIdx < session.discoveryItems.length - 1) {
          const nextItem = session.discoveryItems[itemIdx + 1]
          if (nextItem.subItems.length > 0) {
            setActive(nextItem.id, nextItem.subItems[0].id)
          }
        }
      }
    },
    [session.discoveryItems, setActive]
  )

  const handleJumpToPrevItem = useCallback(
    (itemId: string) => {
      const itemIdx = session.discoveryItems.findIndex((i) => i.id === itemId)
      if (itemIdx > 0) {
        const prevItem = session.discoveryItems[itemIdx - 1]
        if (prevItem.subItems.length > 0) {
          setActive(prevItem.id, prevItem.subItems[0].id)
        }
      }
    },
    [session.discoveryItems, setActive]
  )

  const handleJumpToNextItem = useCallback(
    (itemId: string) => {
      const itemIdx = session.discoveryItems.findIndex((i) => i.id === itemId)
      if (itemIdx < session.discoveryItems.length - 1) {
        const nextItem = session.discoveryItems[itemIdx + 1]
        if (nextItem.subItems.length > 0) {
          setActive(nextItem.id, nextItem.subItems[0].id)
        }
      }
    },
    [session.discoveryItems, setActive]
  )

  const handleConfirmAndNextItem = useCallback(
    (itemIndex: number) => {
      // Always add a new discovery item after the current one
      // Focus is handled by the useEffect that detects new items
      dispatch({ type: "ADD_DISCOVERY_ITEM", afterIndex: itemIndex })
    },
    []
  )

  // After ADD_DISCOVERY_ITEM, focus the new item's title
  const [prevItemCount, setPrevItemCount] = useState(session.discoveryItems.length)

  useEffect(() => {
    if (session.discoveryItems.length > prevItemCount) {
      // A new item was added - find it (it has an empty title)
      const newItem = session.discoveryItems.find((item) => item.title === "" && item.subItems.length === 1 && item.subItems[0].content === "")
      if (newItem) {
        setActiveItemId(newItem.id)
        setActiveSubItemId(null)
        setFocusTitleItemId(newItem.id)
        setFocusKey((k) => k + 1)
      }
    }
    setPrevItemCount(session.discoveryItems.length)
  }, [session.discoveryItems.length, prevItemCount])

  const handleQuickAdd = useCallback(
    (itemId: string, type: SubItemType) => {
      dispatch({ type: "ADD_SUB_ITEM", itemId, subItemType: type })
      setActiveItemId(itemId)
    },
    []
  )

  const handleComplete = useCallback(async () => {
    await completeSessionAction(session.id, session.clientId)
    dispatch({ type: "SET_STATUS", status: "completed" })
    router.push(`/clients/${session.clientId}`)
  }, [session.id, session.clientId, router])

  // Collapse/expand keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!activeItemId) return
      const isMeta = e.metaKey || e.ctrlKey
      if (e.key === "[" && isMeta) {
        e.preventDefault()
        dispatch({ type: "TOGGLE_COLLAPSE", itemId: activeItemId })
      }
      if (e.key === "]" && isMeta) {
        e.preventDefault()
        dispatch({ type: "TOGGLE_COLLAPSE", itemId: activeItemId })
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeItemId])

  return (
    <div className="space-y-6">
      <SessionHeader
        session={session}
        saveStatus={status}
        onSave={forceSave}
        onComplete={handleComplete}
      />

      <div className="space-y-3">
        {session.discoveryItems.map((item, index) => (
          <DiscoveryItemCard
            key={item.id}
            item={item}
            itemIndex={index}
            activeSubItemId={activeItemId === item.id ? activeSubItemId : null}
            focusKey={focusKey}
            focusTitleItemId={focusTitleItemId}
            dispatch={dispatch}
            onSetActive={setActive}
            onNavigateUp={handleNavigateUp}
            onNavigateDown={handleNavigateDown}
            onJumpToPrevItem={handleJumpToPrevItem}
            onJumpToNextItem={handleJumpToNextItem}
            onConfirmAndNextItem={handleConfirmAndNextItem}
            onQuickAdd={handleQuickAdd}
            onSave={forceSave}
          />
        ))}
      </div>

      <Button
        variant="outline"
        onClick={() => dispatch({ type: "ADD_DISCOVERY_ITEM" })}
        className="w-full border-dashed"
      >
        + Add Discovery Topic
      </Button>

      <SessionNotes
        notes={session.notes}
        onChange={(notes) => dispatch({ type: "UPDATE_NOTES", notes })}
      />
    </div>
  )
}
