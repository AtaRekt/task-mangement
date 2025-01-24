"use client"

import { usePathname, useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { User } from 'lucide-react'

interface SecondaryNavProps {
    user: {
        name: string;
        email: string;
        role: number;
    }
}

import { logout } from "@/app/actions/auth"

const pageTranslations: { [key: string]: string } = {
    'dashboard': 'Kontrol Paneli',
    'projects': 'Projeler',
    'tasks': 'Görevler',
    'users': 'Kullanıcılar',
}

export default function SecondaryNav({ user }: SecondaryNavProps) {
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = async () => {
        router.push('/login')
        await logout()
    }

    const getPageIndicator = () => {
        const parts = pathname.split('/').filter(Boolean)
        return (
            <div className="flex items-center text-sm">
                {parts.map((part, index) => (
                    <span key={index} className="flex items-center">
                        {index > 0 && <span className="text-muted-foreground mx-1.5">/</span>}
                        <span className={cn(
                            index === parts.length - 1 ? "text-foreground" : "text-muted-foreground"
                        )}>
                            {pageTranslations[part] || part.charAt(0).toUpperCase() + part.slice(1)}
                        </span>
                    </span>
                ))}
            </div>
        )
    }

    return (
        <nav className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
            <div className="w-full mx-auto px-4">
                <div className="flex justify-between items-center py-2">
                    {getPageIndicator()}
                    <div className="flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <User className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user.name}
                                            {user.role === 1 && (
                                                <span className="ml-2 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                                                    Admin
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className='cursor-pointer'
                                    onClick={handleLogout}
                                >
                                    Çıkış Yap
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    )
}
