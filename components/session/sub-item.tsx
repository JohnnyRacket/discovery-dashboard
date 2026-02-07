"use client"

import { SubItem as SubItemType, SubItemType as SubItemTypeEnum } from "@/lib/types"
import { SubItemTypeBadge } from "./sub-item-type-badge"
import { SubItemEditor } from "./sub-item-editor"

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
  onNavigateLeft: () => void
  onNavigateRight: () => void
  onAddDiscoveryItem: () => void
  onQuickAddFollowUp: () => void
  onQuickAddActionItem: () => void
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
  onNavigateLeft,
  onNavigateRight,
  onAddDiscoveryItem,
  onQuickAddFollowUp,
  onQuickAddActionItem,
  onSave,
  onFocus,
  focusKey,
}: SubItemProps) {
  return (
    <div
      className={`flex items-start gap-2 px-3 py-1.5 rounded-md transition-colors group ${
        isActive ? "bg-accent/50" : "hover:bg-accent/30"
      } ${subItem.resolved ? "opacity-50" : ""}`}
      onClick={onFocus}
    >
      <div className="flex-shrink-0 mt-0.5">
        <SubItemTypeBadge type={subItem.type} />
      </div>
      <div className="flex-1 min-w-0">
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
          onNavigateLeft={onNavigateLeft}
          onNavigateRight={onNavigateRight}
          onAddDiscoveryItem={onAddDiscoveryItem}
          onQuickAddFollowUp={onQuickAddFollowUp}
          onQuickAddActionItem={onQuickAddActionItem}
          onSave={onSave}
          autoFocus={isActive}
          focusKey={focusKey}
        />
      </div>
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {subItem.important && <span className="text-xs">⭐</span>}
        {subItem.resolved && <span className="text-xs">✓</span>}
      </div>
    </div>
  )
}
