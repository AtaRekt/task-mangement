"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { CellAction } from "./cell-action"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "İsim",
    meta: {
      width: "w-[200px]"
    }
  },
  {
    accessorKey: "email",
    header: "E-posta",
    meta: {
      width: "w-[250px]"
    }
  },
  {
    accessorKey: "role",
    header: "Yetki",
    meta: {
      width: "w-[100px]"
    },
    cell: ({ row }) => (
      <Badge variant={row.original.role === 1 ? "default" : "secondary"}>
        {row.original.role === 1 ? "Admin" : "Kullanıcı"}
      </Badge>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Kayıt Tarihi",
    meta: {
      width: "w-[120px]"
    },
    cell: ({ row }) => format(new Date(row.original.createdAt), 'd MMM yyyy')
  },
  {
    id: "actions",
    meta: {
      width: "w-[50px]"
    },
    cell: ({ row }) => <CellAction data={row.original} />
  }
] 