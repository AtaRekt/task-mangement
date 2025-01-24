"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { ProjectModal } from "./project-modal"
import { useProjects } from "@/hooks/use-projects"
import { ProjectsSkeleton } from "./projects-skeleton"
import { toast } from "sonner"

export function ProjectsClient() {
  const [open, setOpen] = useState(false)
  const { data: projects, isLoading, error } = useProjects()

  if (error) {
    toast.error("Projeler yüklenirken bir hata oluştu")
    return null
  }

  if (isLoading) {
    return <ProjectsSkeleton columns={columns} />
  }

  return (
    <>
      <ProjectModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
      />
      <div className="flex items-center gap-8 gap-y-4 sm:justify-between justify-center flex-wrap">
        <h2 className="text-3xl font-bold tracking-tight">Projeler</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Proje
        </Button>
      </div>
      <DataTable searchKey="name" columns={columns} data={projects || []} />
    </>
  )
} 