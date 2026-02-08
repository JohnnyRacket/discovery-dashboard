import { SubItemType } from "./types"

export const SUB_ITEM_TYPE_ORDER: SubItemType[] = [
  "note",
  "follow-up",
  "special-case",
  "requirement",
  "question",
]

export const SUB_ITEM_TYPE_CONFIG: Record<SubItemType, { label: string; icon: string; color: string; bgColor: string }> = {
  "note": {
    label: "Note",
    icon: "📝",
    color: "text-stone-600",
    bgColor: "bg-stone-100",
  },
  "follow-up": {
    label: "Follow-up",
    icon: "🔄",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  "special-case": {
    label: "Special Case",
    icon: "⭐",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  "requirement": {
    label: "Requirement",
    icon: "📋",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  "question": {
    label: "Question",
    icon: "❓",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
}

export const SESSION_STATUSES = ["active", "completed"] as const
