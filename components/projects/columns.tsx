"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { CellAction } from "@/components/projects/cell-action"

// Meta tipi için tanımlama
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends unknown, TValue> {
    width?: string
  }
}

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Proje Adı",
    meta: {
      width: "w-[250px]"
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
    accessorKey: "deadline",
    header: "Bitiş Tarihi",
    meta: {
      width: "w-[120px]"
    },
    cell: ({ row }) => format(new Date(row.original.deadline), 'd MMM yyyy')
  },
  {
    id: "actions",
    meta: {
      width: "w-[50px]"
    },
    cell: ({ row }) => <CellAction data={row.original} />
  }
] 