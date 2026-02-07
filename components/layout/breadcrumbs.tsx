"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"

export function Breadcrumbs() {
  const pathname = usePathname()
  if (pathname === "/") return null

  const segments = pathname.split("/").filter(Boolean)
  const crumbs: { label: string; href: string }[] = []

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    const href = "/" + segments.slice(0, i + 1).join("/")

    if (seg === "clients") {
      crumbs.push({ label: "Clients", href: "/" })
    } else if (seg === "new") {
      crumbs.push({ label: "New", href })
    } else if (seg === "sessions") {
      crumbs.push({ label: "Sessions", href })
    } else if (segments[i - 1] === "clients") {
      crumbs.push({ label: "Client", href })
    } else if (segments[i - 1] === "sessions") {
      crumbs.push({ label: "Session", href })
    }
  }

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <span className="text-muted-foreground/50">/</span>
          {i === crumbs.length - 1 ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-foreground transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
