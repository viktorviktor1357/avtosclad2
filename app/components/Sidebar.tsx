"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "../contexts/ThemeContext"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, ClipboardList, Truck, BarChart, Sun, Moon } from "lucide-react"

const navItems = [
  { href: "/", label: "Обзор", icon: LayoutDashboard },
  { href: "/inventory", label: "Инвентарь", icon: Package },
  { href: "/orders", label: "Заказы", icon: ClipboardList },
  { href: "/suppliers", label: "Поставщики", icon: Truck },

]

export default function Sidebar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex h-screen w-64 flex-col bg-background">
      <div className="flex h-16 items-center justify-between border-b px-4">
        <h1 className="text-2xl font-bold">Склад</h1>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className={cn("w-full justify-start", pathname === item.href && "bg-secondary")}>
                <Icon className="mr-2 h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

