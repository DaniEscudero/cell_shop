"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, ShoppingBag, Users } from "lucide-react"

import { Button } from "@/components/ui/button"

export function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: ShoppingBag,
      isActive:
        isActive("/dashboard") &&
        !isActive("/dashboard/usuarios") &&
        !isActive("/dashboard/pedidos") &&
        !isActive("/dashboard/productos"),
    },
    {
      name: "Usuarios",
      href: "/dashboard/usuarios",
      icon: Users,
      isActive: isActive("/dashboard/usuarios"),
    },
    {
      name: "Pedidos",
      href: "/dashboard/pedidos",
      icon: Package,
      isActive: isActive("/dashboard/pedidos"),
    },
    {
      name: "Productos",
      href: "/dashboard/productos",
      icon: ShoppingBag,
      isActive: isActive("/dashboard/productos"),
    },
  ]

  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <ShoppingBag className="h-6 w-6" />
          <span>Admin Dashboard</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <Button key={item.href} asChild variant={item.isActive ? "secondary" : "ghost"} className="justify-start">
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CellShop Admin</p>
      </div>
    </div>
  )
}
