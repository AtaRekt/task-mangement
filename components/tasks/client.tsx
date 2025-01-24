"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { TaskModal } from "./task-modal"
import { useTasks } from "@/hooks/use-tasks"
import { useUsers } from "@/hooks/use-users"
import { useProjects } from "@/hooks/use-projects"
import { TasksSkeleton } from "./tasks-skeleton"
import { toast } from "sonner"

interface TasksClientProps {
  isAdmin: boolean
}

export function TasksClient({
  isAdmin,
}: TasksClientProps) {
  const [open, setOpen] = useState(false)
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useTasks()
  const { data: users, isLoading: usersLoading } = useUsers()
  const { data: projects, isLoading: projectsLoading } = useProjects()

  const isLoading = tasksLoading || usersLoading || projectsLoading

  if (tasksError) {
    toast.error("Görevler yüklenirken bir hata oluştu")
    return null
  }

  if (isLoading) {
    return <TasksSkeleton columns={columns} />
  }

  return (
    <div>
      <TaskModal 
        users={users || []}
        projects={projects || []}
        isOpen={open} 
        onClose={() => setOpen(false)}
      />
      <div className="flex items-center gap-8 gap-y-4 sm:justify-between justify-center flex-wrap">
        <h2 className="text-3xl font-bold tracking-tight">Görevler</h2>
        {isAdmin && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Görev
          </Button>
        )}
      </div>
      <DataTable 
        searchKey="title" 
        columns={columns} 
        data={tasks || []}
        meta={{ users: users || [], projects: projects || [] }}
      />
    </div>
  )
} 