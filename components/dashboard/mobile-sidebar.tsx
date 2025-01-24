"use client"

import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NavLinks } from "./nav-links"
import Image from "next/image"

interface MobileSidebarProps {
  user: {
    role: number;
  }
}

export function MobileSidebar({ user }: MobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-[#0c5db2] text-white">
        <div className="p-6 flex justify-center items-center border-b border-white/10">
          <Image 
            src="/logo.webp" 
            alt="D-Group" 
            width={128} 
            height={43} 
            className="h-full object-contain" 
          />
        </div>
        <ScrollArea className="h-[calc(100vh-81px)]">
          <NavLinks user={user} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
} 