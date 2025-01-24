"use client"

import { ColumnDef, TableMeta } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CellAction, CellActionProps } from "./cell-action"

// Meta tipleri için tanımlama
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends unknown> {
    users?: any[]
    projects?: any[]
  }

  interface ColumnMeta<TData extends unknown, TValue> {
    width?: string
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'TODO':
      return <Badge variant="secondary">Yapılacak</Badge>
    case 'IN_PROGRESS':
      return <Badge variant="default">Devam Ediyor</Badge>
    case 'COMPLETED':
      return <Badge variant="outline">Tamamlandı</Badge>
    default:
      return null
  }
}

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Başlık",
    meta: {
      width: "w-[200px]"
    }
  },
  {
    accessorKey: "description",
    header: "Açıklama",
    meta: {
      width: "w-[300px]"
    }
  },
  {
    accessorKey: "project.name",
    header: "Proje",
    meta: {
      width: "w-[150px]"
    },
    cell: ({ row }) => row.original.project?.name || "Proje Yok"
  },
  {
    accessorKey: "status",
    header: "Durum",
    meta: {
      width: "w-[100px]"
    },
    cell: ({ row }) => getStatusBadge(row.original.status)
  },
  {
    accessorKey: "user.name",
    header: "Atanan Kişi",
    meta: {
      width: "w-[150px]"
    }
  },
  {
    accessorKey: "deadline",
    header: "Son Tarih",
    meta: {
      width: "w-[100px]"
    },
    cell: ({ row }) => format(new Date(row.original.deadline), 'd MMM yyyy')
  },
  {
    id: "actions",
    meta: {
      width: "w-[50px]"
    },
    cell: ({ row, table }) => <CellAction 
      data={row.original} 
      users={table.options.meta?.users}
      projects={table.options.meta?.projects}
    />
  }
] 