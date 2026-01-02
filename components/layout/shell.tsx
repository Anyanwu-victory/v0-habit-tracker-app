"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, CheckCircle2, Calendar, Cpu, Wallet, FileText, Menu, X, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Habits", href: "/habits", icon: CheckCircle2 },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Skills", href: "/skills", icon: Cpu },
  { name: "Finance", href: "/finance", icon: Wallet },
  { name: "Weekly", href: "/weekly", icon: FileText },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div className={cn("min-h-screen bg-brand text-foreground", isDark && "dark")}>
      {/* Mobile Nav */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <span className="text-xl font-bold text-pink-600">Focus</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed h-full left-0 z-40 w-64 transform border-r bg-background transition-transform duration-200 lg:translate-x-0 lg:static",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-full flex-col p-6">
            <div className="mb-8 hidden items-center justify-between lg:flex">
              <span className="text-2xl font-bold text-pink-600"><Link href="/">Focus</Link></span>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 py-8 lg:px-8 max-w-5xl mx-auto w-full">{children}</main>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setIsOpen(false)} />}
    </div>
  )
}
