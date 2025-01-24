"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { AlertModal } from "@/components/modals/alert-modal"
import { deleteTask, updateTaskStatus } from "@/app/dashboard/tasks/actions"
import { TaskModal } from "./task-modal"
import { useDeleteTask } from "@/hooks/use-tasks"

export interface CellActionProps {
  data: any;
  users?: any[];
  projects?: any[];
}

export function CellAction({
  data,
  users = [],
  projects = []
}: CellActionProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  
  const deleteTaskMutation = useDeleteTask()

  const onDelete = async () => {
    deleteTaskMutation.mutate(data.id, {
      onSuccess: () => {
        setOpen(false)
      }
    })
  }

  const onStatusChange = async () => {
    try {
      setLoading(true)
      const nextStatus = {
        'TODO': 'IN_PROGRESS',
        'IN_PROGRESS': 'COMPLETED',
        'COMPLETED': 'TODO'
      }[data.status as "TODO" | "IN_PROGRESS" | "COMPLETED"]
      
      await updateTaskStatus(data.id, nextStatus)
      toast.success("Görev durumu güncellendi.")
      router.refresh()
    } catch (error) {
      toast.error("Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={deleteTaskMutation.isPending}
      />
      <TaskModal 
        data={data}
        users={users}
        projects={projects}
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
          <DropdownMenuItem onClick={onStatusChange}>
            <Edit className="mr-2 h-4 w-4" />
            Durumu Değiştir
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