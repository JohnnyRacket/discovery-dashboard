export type SubItemType = "note" | "special-case" | "follow-up" | "action-item" | "requirement" | "objection" | "decision"

export interface SubItem {
  id: string
  type: SubItemType
  content: string
  resolved: boolean
  important: boolean
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface DiscoveryItem {
  id: string
  title: string
  subItems: SubItem[]
  collapsed: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface Session {
  id: string
  clientId: string
  date: string
  title: string
  discoveryItems: DiscoveryItem[]
  notes: string
  status: "active" | "completed"
  createdAt: string
  updatedAt: string
}

export interface Client {
  id: string
  name: string
  company: string
  contactEmail?: string
  contactPhone?: string
  industry?: string
  notes?: string
  createdAt: string
  updatedAt: string
}
