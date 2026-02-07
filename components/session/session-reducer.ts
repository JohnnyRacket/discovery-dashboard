import { nanoid } from "nanoid"
import { DiscoveryItem, Session, SubItem, SubItemType } from "@/lib/types"
import { SUB_ITEM_TYPE_ORDER } from "@/lib/constants"

export type SessionAction =
  | { type: "SET_SESSION"; session: Session }
  | { type: "ADD_DISCOVERY_ITEM"; afterIndex?: number }
  | { type: "UPDATE_DISCOVERY_ITEM_TITLE"; itemId: string; title: string }
  | { type: "DELETE_DISCOVERY_ITEM"; itemId: string }
  | { type: "TOGGLE_COLLAPSE"; itemId: string }
  | { type: "ADD_SUB_ITEM"; itemId: string; subItemType: SubItemType }
  | { type: "UPDATE_SUB_ITEM_CONTENT"; itemId: string; subItemId: string; content: string }
  | { type: "UPDATE_SUB_ITEM_TYPE"; itemId: string; subItemId: string; subItemType: SubItemType }
  | { type: "TOGGLE_RESOLVED"; itemId: string; subItemId: string }
  | { type: "TOGGLE_IMPORTANT"; itemId: string; subItemId: string }
  | { type: "SET_DUE_DATE"; itemId: string; subItemId: string; dueDate: string }
  | { type: "DELETE_SUB_ITEM"; itemId: string; subItemId: string }
  | { type: "UPDATE_NOTES"; notes: string }
  | { type: "SET_STATUS"; status: "active" | "completed" }

function createSubItem(itemType: SubItemType): SubItem {
  const now = new Date().toISOString()
  return {
    id: nanoid(),
    type: itemType,
    content: "",
    resolved: false,
    important: false,
    createdAt: now,
    updatedAt: now,
  }
}

function createDiscoveryItem(order: number): DiscoveryItem {
  const now = new Date().toISOString()
  return {
    id: nanoid(),
    title: "",
    subItems: [createSubItem("note")],
    collapsed: false,
    order,
    createdAt: now,
    updatedAt: now,
  }
}

function updateItem(items: DiscoveryItem[], itemId: string, updater: (item: DiscoveryItem) => DiscoveryItem): DiscoveryItem[] {
  return items.map((item) => (item.id === itemId ? updater(item) : item))
}

function updateSubItem(items: DiscoveryItem[], itemId: string, subItemId: string, updater: (sub: SubItem) => SubItem): DiscoveryItem[] {
  return updateItem(items, itemId, (item) => ({
    ...item,
    updatedAt: new Date().toISOString(),
    subItems: item.subItems.map((sub) => (sub.id === subItemId ? updater(sub) : sub)),
  }))
}

export function sessionReducer(state: Session, action: SessionAction): Session {
  switch (action.type) {
    case "SET_SESSION":
      return action.session

    case "ADD_DISCOVERY_ITEM": {
      const insertAt = action.afterIndex !== undefined ? action.afterIndex + 1 : state.discoveryItems.length
      const newItems = [...state.discoveryItems]
      const newItem = createDiscoveryItem(insertAt)
      newItems.splice(insertAt, 0, newItem)
      // Re-order
      return {
        ...state,
        discoveryItems: newItems.map((item, i) => ({ ...item, order: i })),
        updatedAt: new Date().toISOString(),
      }
    }

    case "UPDATE_DISCOVERY_ITEM_TITLE":
      return {
        ...state,
        discoveryItems: updateItem(state.discoveryItems, action.itemId, (item) => ({
          ...item,
          title: action.title,
          updatedAt: new Date().toISOString(),
        })),
        updatedAt: new Date().toISOString(),
      }

    case "DELETE_DISCOVERY_ITEM":
      return {
        ...state,
        discoveryItems: state.discoveryItems
          .filter((item) => item.id !== action.itemId)
          .map((item, i) => ({ ...item, order: i })),
        updatedAt: new Date().toISOString(),
      }

    case "TOGGLE_COLLAPSE":
      return {
        ...state,
        discoveryItems: updateItem(state.discoveryItems, action.itemId, (item) => ({
          ...item,
          collapsed: !item.collapsed,
        })),
      }

    case "ADD_SUB_ITEM": {
      const newSub = createSubItem(action.subItemType)
      return {
        ...state,
        discoveryItems: updateItem(state.discoveryItems, action.itemId, (item) => ({
          ...item,
          subItems: [...item.subItems, newSub],
          updatedAt: new Date().toISOString(),
        })),
        updatedAt: new Date().toISOString(),
      }
    }

    case "UPDATE_SUB_ITEM_CONTENT":
      return {
        ...state,
        discoveryItems: updateSubItem(state.discoveryItems, action.itemId, action.subItemId, (sub) => ({
          ...sub,
          content: action.content,
          updatedAt: new Date().toISOString(),
        })),
        updatedAt: new Date().toISOString(),
      }

    case "UPDATE_SUB_ITEM_TYPE":
      return {
        ...state,
        discoveryItems: updateSubItem(state.discoveryItems, action.itemId, action.subItemId, (sub) => ({
          ...sub,
          type: action.subItemType,
          updatedAt: new Date().toISOString(),
        })),
        updatedAt: new Date().toISOString(),
      }

    case "TOGGLE_RESOLVED":
      return {
        ...state,
        discoveryItems: updateSubItem(state.discoveryItems, action.itemId, action.subItemId, (sub) => ({
          ...sub,
          resolved: !sub.resolved,
          updatedAt: new Date().toISOString(),
        })),
        updatedAt: new Date().toISOString(),
      }

    case "TOGGLE_IMPORTANT":
      return {
        ...state,
        discoveryItems: updateSubItem(state.discoveryItems, action.itemId, action.subItemId, (sub) => ({
          ...sub,
          important: !sub.important,
          updatedAt: new Date().toISOString(),
        })),
        updatedAt: new Date().toISOString(),
      }

    case "SET_DUE_DATE":
      return {
        ...state,
        discoveryItems: updateSubItem(state.discoveryItems, action.itemId, action.subItemId, (sub) => ({
          ...sub,
          dueDate: action.dueDate,
          updatedAt: new Date().toISOString(),
        })),
        updatedAt: new Date().toISOString(),
      }

    case "DELETE_SUB_ITEM":
      return {
        ...state,
        discoveryItems: updateItem(state.discoveryItems, action.itemId, (item) => ({
          ...item,
          subItems: item.subItems.filter((sub) => sub.id !== action.subItemId),
          updatedAt: new Date().toISOString(),
        })),
        updatedAt: new Date().toISOString(),
      }

    case "UPDATE_NOTES":
      return { ...state, notes: action.notes, updatedAt: new Date().toISOString() }

    case "SET_STATUS":
      return { ...state, status: action.status, updatedAt: new Date().toISOString() }

    default:
      return state
  }
}

export function cycleSubItemType(current: SubItemType, direction: "forward" | "backward"): SubItemType {
  const idx = SUB_ITEM_TYPE_ORDER.indexOf(current)
  if (direction === "forward") {
    return SUB_ITEM_TYPE_ORDER[(idx + 1) % SUB_ITEM_TYPE_ORDER.length]
  }
  return SUB_ITEM_TYPE_ORDER[(idx - 1 + SUB_ITEM_TYPE_ORDER.length) % SUB_ITEM_TYPE_ORDER.length]
}

export function getSubItemTypeByIndex(index: number): SubItemType | undefined {
  return SUB_ITEM_TYPE_ORDER[index]
}
