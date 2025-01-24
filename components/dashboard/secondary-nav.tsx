"use client"

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout } from "@/app/actions/auth"
import { User } from 'lucide-react'
import { MobileSidebar } from "./mobile-sidebar"

interface SecondaryNavProps {
    user: {
        name: string;
        email: string;
        role: number;
    }
}

export default function SecondaryNav({ user }: SecondaryNavProps) {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await logout()
            router.push('/login')
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return (
        <header className="sticky top-0 z-40 border-b bg-background">
            <div className="w-full flex h-16 items-center justify-between px-8 pr-4">
                <div className="flex items-center gap-4">
                    <MobileSidebar user={user} />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-60" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm break-words font-medium leading-none">
                                    {user.name}
                                </p>

                                <p className="text-xs break-all w-full text-muted-foreground">
                                    {user.email}
                                </p>
                                {user.role === 1 && (
                                    <div>
                                        <span className=" text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                                            Admin
                                        </span>
                                    </div>
                                )}
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
        </header>
    )
}
