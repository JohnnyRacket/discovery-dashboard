"use client"

import { useRef, useEffect } from "react"
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
  dispatch: React.Dispatch<SessionAction>
  onSetActive: (itemId: string, subItemId: string | null) => void
  onNavigateUp: (itemId: string, subItemIndex: number) => void
  onNavigateDown: (itemId: string, subItemIndex: number) => void
  onNavigateLeft: (itemIndex: number) => void
  onNavigateRight: (itemIndex: number) => void
  onAddDiscoveryItem: (afterIndex: number) => void
  onConfirmAndNextItem: (itemIndex: number) => void
  onQuickAdd: (itemId: string, type: SubItemType) => void
  onSave: () => void
}

export function DiscoveryItemCard({
  item,
  itemIndex,
  activeSubItemId,
  focusKey,
  dispatch,
  onSetActive,
  onNavigateUp,
  onNavigateDown,
  onNavigateLeft,
  onNavigateRight,
  onAddDiscoveryItem,
  onConfirmAndNextItem,
  onQuickAdd,
  onSave,
}: DiscoveryItemProps) {
  const titleRef = useRef<HTMLInputElement>(null)

  return (
    <Card className="border-l-4 border-l-primary/30">
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
                {item.collapsed ? "▸" : "▾"}
              </Button>
            </CollapsibleTrigger>
            <span className="text-xs text-muted-foreground font-medium">#{itemIndex + 1}</span>
            <input
              ref={titleRef}
              value={item.title}
              onChange={(e) =>
                dispatch({ type: "UPDATE_DISCOVERY_ITEM_TITLE", itemId: item.id, title: e.target.value })
              }
              className="flex-1 bg-transparent font-medium outline-none placeholder:text-muted-foreground/50"
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
                    // Add new sub-item of same type
                    dispatch({ type: "ADD_SUB_ITEM", itemId: item.id, subItemType: subItem.type })
                  }}
                  onConfirmAndNext={() => onConfirmAndNextItem(itemIndex)}
                  onDelete={() => dispatch({ type: "DELETE_SUB_ITEM", itemId: item.id, subItemId: subItem.id })}
                  onToggleResolved={() => dispatch({ type: "TOGGLE_RESOLVED", itemId: item.id, subItemId: subItem.id })}
                  onToggleImportant={() => dispatch({ type: "TOGGLE_IMPORTANT", itemId: item.id, subItemId: subItem.id })}
                  onNavigateUp={() => onNavigateUp(item.id, subIndex)}
                  onNavigateDown={() => onNavigateDown(item.id, subIndex)}
                  onNavigateLeft={() => onNavigateLeft(itemIndex)}
                  onNavigateRight={() => onNavigateRight(itemIndex)}
                  onAddDiscoveryItem={() => onAddDiscoveryItem(itemIndex)}
                  onQuickAddFollowUp={() => onQuickAdd(item.id, "follow-up")}
                  onQuickAddActionItem={() => onQuickAdd(item.id, "action-item")}
                  onSave={onSave}
                  onFocus={() => onSetActive(item.id, subItem.id)}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 text-xs text-muted-foreground h-7"
              onClick={() => dispatch({ type: "ADD_SUB_ITEM", itemId: item.id, subItemType: "note" })}
            >
              + Add item
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
