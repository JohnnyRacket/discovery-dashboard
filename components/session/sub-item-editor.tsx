"use client"

import { useRef, useEffect, useCallback, KeyboardEvent } from "react"
import { SubItemType } from "@/lib/types"
import { cycleSubItemType, getSubItemTypeByIndex } from "./session-reducer"

interface SubItemEditorProps {
  content: string
  type: SubItemType
  onContentChange: (content: string) => void
  onTypeChange: (type: SubItemType) => void
  onConfirm: () => void
  onConfirmAndNext: () => void
  onDelete: () => void
  onToggleResolved: () => void
  onToggleImportant: () => void
  onNavigateUp: () => void
  onNavigateDown: () => void
  onJumpToPrevItem: () => void
  onJumpToNextItem: () => void
  onQuickAddFollowUp: () => void
  onDiscardIfEmpty: () => void
  onSave: () => void
  autoFocus?: boolean
  focusKey?: number
}

export function SubItemEditor({
  content,
  type,
  onContentChange,
  onTypeChange,
  onConfirm,
  onConfirmAndNext,
  onDelete,
  onToggleResolved,
  onToggleImportant,
  onNavigateUp,
  onNavigateDown,
  onJumpToPrevItem,
  onJumpToNextItem,
  onQuickAddFollowUp,
  onDiscardIfEmpty,
  onSave,
  autoFocus,
  focusKey,
}: SubItemEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus, focusKey])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      const isMeta = e.metaKey || e.ctrlKey

      // Tab / Shift+Tab - cycle type
      if (e.key === "Tab" && !isMeta) {
        e.preventDefault()
        const direction = e.shiftKey ? "backward" : "forward"
        onTypeChange(cycleSubItemType(type, direction))
        return
      }

      // Enter - confirm sub-item
      if (e.key === "Enter" && !e.shiftKey && !isMeta) {
        e.preventDefault()
        onConfirm()
        return
      }

      // Cmd+Enter - confirm and add new discovery item after current
      if (e.key === "Enter" && isMeta && !e.shiftKey) {
        e.preventDefault()
        onConfirmAndNext()
        return
      }

      // Shift+Enter - allow newline (default behavior)
      if (e.key === "Enter" && e.shiftKey && !isMeta) {
        return
      }

      // Cmd+D - toggle resolved
      if (e.key === "d" && isMeta) {
        e.preventDefault()
        onToggleResolved()
        return
      }

      // Cmd+B - toggle important (bold)
      if (e.key === "b" && isMeta) {
        e.preventDefault()
        onToggleImportant()
        return
      }

      // Cmd+Backspace - delete
      if (e.key === "Backspace" && isMeta) {
        e.preventDefault()
        onDelete()
        return
      }

      // Cmd+S - save
      if (e.key === "s" && isMeta) {
        e.preventDefault()
        onSave()
        return
      }

      // Cmd+Shift+F - quick follow-up
      if (e.key === "f" && isMeta && e.shiftKey) {
        e.preventDefault()
        onQuickAddFollowUp()
        return
      }

      // Cmd+Up - jump to previous discovery item
      if (e.key === "ArrowUp" && isMeta && !e.shiftKey) {
        e.preventDefault()
        onJumpToPrevItem()
        return
      }

      // Cmd+Down - jump to next discovery item
      if (e.key === "ArrowDown" && isMeta && !e.shiftKey) {
        e.preventDefault()
        onJumpToNextItem()
        return
      }

      // Up arrow - navigate up
      if (e.key === "ArrowUp" && !e.shiftKey) {
        const textarea = textareaRef.current
        if (textarea && textarea.selectionStart === 0) {
          e.preventDefault()
          onNavigateUp()
          return
        }
      }

      // Down arrow - navigate down
      if (e.key === "ArrowDown" && !e.shiftKey) {
        const textarea = textareaRef.current
        if (textarea && textarea.selectionEnd === textarea.value.length) {
          e.preventDefault()
          onNavigateDown()
          return
        }
      }

      // Alt+1..4 - jump to type
      if (e.altKey && e.key >= "1" && e.key <= "4") {
        e.preventDefault()
        const idx = parseInt(e.key) - 1
        const targetType = getSubItemTypeByIndex(idx)
        if (targetType) onTypeChange(targetType)
        return
      }
    },
    [
      type, onTypeChange, onConfirm, onConfirmAndNext, onDelete,
      onToggleResolved, onToggleImportant, onNavigateUp, onNavigateDown,
      onJumpToPrevItem, onJumpToNextItem, onQuickAddFollowUp, onSave,
    ]
  )

  const handleBlur = useCallback(() => {
    if (content.trim() === "") {
      onDiscardIfEmpty()
    }
  }, [content, onDiscardIfEmpty])

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = textarea.scrollHeight + 1 + "px"
    }
  }, [content])

  return (
    <textarea
      ref={textareaRef}
      value={content}
      onChange={(e) => onContentChange(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 min-h-[1.5rem] leading-relaxed"
      placeholder="Type here... (Tab to change type, Enter to confirm)"
      rows={1}
    />
  )
}
