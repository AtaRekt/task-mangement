"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { AlertModal } from "@/components/modals/alert-modal"
import { UserModal } from "./user-modal"
import { useDeleteUser } from "@/hooks/use-users"

interface CellActionProps {
  data: any
}

export function CellAction({
  data
}: CellActionProps) {
  const [open, setOpen] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  
  const deleteUserMutation = useDeleteUser()

  const onDelete = async () => {
    try {
      await deleteUserMutation.mutateAsync(data.id)
      setOpen(false)
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  return (
    <>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={deleteUserMutation.isPending}
      />
      <UserModal 
        data={data}
        isOpen={showEdit} 
        onClose={() => setShowEdit(false)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Menüyü aç</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setShowEdit(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Düzenle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
} 