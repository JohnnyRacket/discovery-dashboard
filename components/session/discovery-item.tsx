"use client"

import { useRef, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { DiscoveryItem as DiscoveryItemType, SubItemType } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SubItemRow } from "./sub-item"
import { SessionAction } from "./session-reducer"

interface DiscoveryItemProps {
  item: DiscoveryItemType
  itemIndex: number
  activeSubItemId: string | null
  focusKey: number
  focusTitleItemId: string | null
  dispatch: React.Dispatch<SessionAction>
  onSetActive: (itemId: string, subItemId: string | null) => void
  onNavigateUp: (itemId: string, subItemIndex: number) => void
  onNavigateDown: (itemId: string, subItemIndex: number) => void
  onJumpToPrevItem: (itemId: string) => void
  onJumpToNextItem: (itemId: string) => void
  onConfirmAndNextItem: (itemIndex: number) => void
  onQuickAdd: (itemId: string, type: SubItemType) => void
  onSave: () => void
}

export function DiscoveryItemCard({
  item,
  itemIndex,
  activeSubItemId,
  focusKey,
  focusTitleItemId,
  dispatch,
  onSetActive,
  onNavigateUp,
  onNavigateDown,
  onJumpToPrevItem,
  onJumpToNextItem,
  onConfirmAndNextItem,
  onQuickAdd,
  onSave,
}: DiscoveryItemProps) {
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focusTitleItemId === item.id && titleRef.current) {
      titleRef.current.focus()
    }
  }, [focusTitleItemId, item.id, focusKey])

  return (
    <Card className="bg-muted/50 border-0 shadow-none">
      <Collapsible open={!item.collapsed}>
        <CardHeader className="pb-2 pt-3 px-4">
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-muted-foreground"
                onClick={() => dispatch({ type: "TOGGLE_COLLAPSE", itemId: item.id })}
              >
                <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${item.collapsed ? "" : "rotate-90"}`} />
              </Button>
            </CollapsibleTrigger>
            <span className="text-xs font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{itemIndex + 1}</span>
            <input
              ref={titleRef}
              value={item.title}
              onChange={(e) =>
                dispatch({ type: "UPDATE_DISCOVERY_ITEM_TITLE", itemId: item.id, title: e.target.value })
              }
              className="flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-muted-foreground/50"
              placeholder="Discovery topic or question..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  // Focus first sub-item
                  if (item.subItems.length > 0) {
                    onSetActive(item.id, item.subItems[0].id)
                  }
                }
                if (e.key === "[" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  if (!item.collapsed) dispatch({ type: "TOGGLE_COLLAPSE", itemId: item.id })
                }
                if (e.key === "]" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  if (item.collapsed) dispatch({ type: "TOGGLE_COLLAPSE", itemId: item.id })
                }
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-muted-foreground"
              onClick={() => dispatch({ type: "DELETE_DISCOVERY_ITEM", itemId: item.id })}
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-3 px-4">
            <div className="space-y-0.5">
              {item.subItems.map((subItem, subIndex) => (
                <SubItemRow
                  key={subItem.id}
                  subItem={subItem}
                  itemId={item.id}
                  isActive={activeSubItemId === subItem.id}
                  focusKey={focusKey}
                  onContentChange={(content) =>
                    dispatch({
                      type: "UPDATE_SUB_ITEM_CONTENT",
                      itemId: item.id,
                      subItemId: subItem.id,
                      content,
                    })
                  }
                  onTypeChange={(subItemType) =>
                    dispatch({
                      type: "UPDATE_SUB_ITEM_TYPE",
                      itemId: item.id,
                      subItemId: subItem.id,
                      subItemType,
                    })
                  }
                  onConfirm={() => {
                    dispatch({ type: "ADD_SUB_ITEM", itemId: item.id, subItemType: subItem.type })
                  }}
                  onConfirmAndNext={() => onConfirmAndNextItem(itemIndex)}
                  onDelete={() => dispatch({ type: "DELETE_SUB_ITEM", itemId: item.id, subItemId: subItem.id })}
                  onToggleResolved={() => dispatch({ type: "TOGGLE_RESOLVED", itemId: item.id, subItemId: subItem.id })}
                  onToggleImportant={() => dispatch({ type: "TOGGLE_IMPORTANT", itemId: item.id, subItemId: subItem.id })}
                  onNavigateUp={() => onNavigateUp(item.id, subIndex)}
                  onNavigateDown={() => onNavigateDown(item.id, subIndex)}
                  onJumpToPrevItem={() => onJumpToPrevItem(item.id)}
                  onJumpToNextItem={() => onJumpToNextItem(item.id)}
                  onQuickAddFollowUp={() => onQuickAdd(item.id, "follow-up")}
                  onDiscardIfEmpty={() => {
                    // Don't delete if it's the only sub-item
                    if (item.subItems.length > 1) {
                      dispatch({ type: "DELETE_SUB_ITEM", itemId: item.id, subItemId: subItem.id })
                    }
                  }}
                  onSave={onSave}
                  onFocus={() => onSetActive(item.id, subItem.id)}
                />
              ))}
            </div>
            <button
              className="mt-1.5 w-full h-7 border border-dashed border-muted-foreground/25 rounded-md text-xs text-muted-foreground/50 hover:border-muted-foreground/50 hover:text-muted-foreground transition-colors"
              onClick={() => dispatch({ type: "ADD_SUB_ITEM", itemId: item.id, subItemType: "note" })}
            >
              + Add item
            </button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
