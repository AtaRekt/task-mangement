"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, ListTodo, Folder } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NavLinksProps {
  user: {
    role: number;
  }
}

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Anasayfa' },
  { href: '/dashboard/users', icon: Users, label: 'Kullanıcılar', adminOnly: true },
  { href: '/dashboard/tasks', icon: ListTodo, label: 'Görevler', adminOnly: true },
  { href: '/dashboard/projects', icon: Folder, label: 'Projeler', adminOnly: true },
]

export function NavLinks({ user }: NavLinksProps) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-2 p-4">
      {navItems
        .filter(item => !item.adminOnly || user.role === 1)
        .map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.href}
              variant={"ghost"}
              className={cn(
                "w-full justify-start hover:text-white hover:bg-gray-100/10",
                pathname === item.href && "bg-gray-100/10",
                "transition-colors"
              )}
              asChild
            >
              <Link href={item.href}>
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          )
        })}
    </nav>
  )
} 