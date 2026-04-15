import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ShoppingCart, FileText, Building2 } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/invoices', label: 'Invoices', icon: FileText },
]

const adminNavItems = [
  { to: '/suppliers', label: 'Suppliers', icon: Building2 },
]

interface SidebarNavProps {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  const allItems = isAdmin ? [...navItems, ...adminNavItems] : navItems

  return (
    <nav className="flex flex-col gap-1 p-4">
      {allItems.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} onClick={onNavigate}>
          {({ isActive }) => (
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-2',
                isActive && 'bg-accent text-accent-foreground'
              )}
            >
              <Icon className="size-4" />
              {label}
            </Button>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-lg font-semibold">Hyra</span>
      </div>
      <div className="flex-1 overflow-auto">
        <SidebarNav />
      </div>
    </aside>
  )
}
