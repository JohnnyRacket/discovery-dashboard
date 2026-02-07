export type SubItemType = "note" | "follow-up" | "special-case" | "requirement"

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
  summary?: string
  status: "active" | "completed"
  createdAt: string
  updatedAt: string
}

export interface Contact {
  id: string
  name: string
  role?: string
  email?: string
  phone?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Client {
  id: string
  name: string
  company: string
  industry?: string
  notes?: string
  contacts?: Contact[]
  needsSummary?: string[]
  createdAt: string
  updatedAt: string
}
