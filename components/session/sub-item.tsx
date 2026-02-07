"use client"

import { SubItem as SubItemType, SubItemType as SubItemTypeEnum } from "@/lib/types"
import { SubItemTypeBadge } from "./sub-item-type-badge"
import { SubItemEditor } from "./sub-item-editor"
import { Button } from "@/components/ui/button"

interface SubItemProps {
  subItem: SubItemType
  itemId: string
  isActive: boolean
  onContentChange: (content: string) => void
  onTypeChange: (type: SubItemTypeEnum) => void
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
  onFocus: () => void
  focusKey?: number
}

export function SubItemRow({
  subItem,
  isActive,
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
  onFocus,
  focusKey,
}: SubItemProps) {
  return (
    <div
      className={`flex items-start gap-2 pl-5 pr-3 py-1.5 rounded-md transition-colors group ${
        subItem.resolved
          ? "bg-muted"
          : isActive ? "bg-accent/40 ring-1 ring-accent" : "hover:bg-accent/30"
      }`}
      onClick={onFocus}
    >
      <div className="flex-shrink-0">
        <SubItemTypeBadge type={subItem.type} />
      </div>
      <div className={`flex-1 min-w-0 mt-0.5 -mb-[6px] ${subItem.resolved ? "text-muted-foreground" : ""} ${subItem.important ? "font-bold" : ""}`}>
        <SubItemEditor
          content={subItem.content}
          type={subItem.type}
          onContentChange={onContentChange}
          onTypeChange={onTypeChange}
          onConfirm={onConfirm}
          onConfirmAndNext={onConfirmAndNext}
          onDelete={onDelete}
          onToggleResolved={onToggleResolved}
          onToggleImportant={onToggleImportant}
          onNavigateUp={onNavigateUp}
          onNavigateDown={onNavigateDown}
          onJumpToPrevItem={onJumpToPrevItem}
          onJumpToNextItem={onJumpToNextItem}
          onQuickAddFollowUp={onQuickAddFollowUp}
          onDiscardIfEmpty={onDiscardIfEmpty}
          onSave={onSave}
          autoFocus={isActive}
          focusKey={focusKey}
        />
      </div>
      {subItem.resolved && <span className="text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">Done</span>}
      <div className="flex items-center gap-1 flex-shrink-0 mt-0.5 -mb-[3px] opacity-0 group-hover:opacity-100 transition-opacity">
        {subItem.important && <span className="text-xs">⭐</span>}
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          ×
        </Button>
      </div>
    </div>
  )
}
