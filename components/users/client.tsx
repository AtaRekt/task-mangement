"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { useUsers } from "@/hooks/use-users"
import { UsersSkeleton } from "./users-skeleton"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { UserModal } from "./user-modal"

export function UsersClient() {
  const [open, setOpen] = useState(false)
  const { data: users, isLoading, error } = useUsers()

  if (error) {
    toast.error("Kullanıcılar yüklenirken bir hata oluştu")
    return null
  }

  if (isLoading) {
    return <UsersSkeleton columns={columns} />
  }

  return (
    <>
      <UserModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
      />
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Kullanıcılar</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Kullanıcı
        </Button>
      </div>
      <DataTable searchKey="name" columns={columns} data={users || []} />
    </>
  )
} 