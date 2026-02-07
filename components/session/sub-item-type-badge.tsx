import { Badge } from "@/components/ui/badge"
import { SubItemType } from "@/lib/types"
import { SUB_ITEM_TYPE_CONFIG } from "@/lib/constants"

interface SubItemTypeBadgeProps {
  type: SubItemType
  className?: string
}

export function SubItemTypeBadge({ type, className }: SubItemTypeBadgeProps) {
  const config = SUB_ITEM_TYPE_CONFIG[type]
  return (
    <Badge variant="secondary" className={`text-xs gap-1 ${config.color} ${config.bgColor} ${className || ""}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </Badge>
  )
}
