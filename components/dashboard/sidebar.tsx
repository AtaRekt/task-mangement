import { ScrollArea } from "@/components/ui/scroll-area"
import { NavLinks } from "./nav-links"
import Image from "next/image"

interface SidebarProps {
  user: {
    role: number;
  }
}

export default function Sidebar({ user }: SidebarProps) {
  return (
    <div className="hidden lg:flex flex-col h-screen w-64 bg-[#0c5db2] text-white">
      <div className="p-6 flex justify-center items-center border-b border-white/10">
        <Image 
          src="/logo.webp" 
          alt="D-Group" 
          width={128} 
          height={43} 
          className="h-full object-contain" 
        />
      </div>
      <ScrollArea className="flex-1">
        <NavLinks user={user} />
      </ScrollArea>
    </div>
  )
}
