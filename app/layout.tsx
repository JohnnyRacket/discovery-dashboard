import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AppHeader } from "@/components/layout/app-header"
import { KeyboardShortcutProvider } from "@/components/providers/keyboard-shortcut-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Discovery Dashboard",
  description: "Sales engineering discovery call management",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <TooltipProvider>
          <KeyboardShortcutProvider>
            <div className="min-h-screen flex flex-col">
              <AppHeader />
              <main className="flex-1">{children}</main>
            </div>
          </KeyboardShortcutProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
