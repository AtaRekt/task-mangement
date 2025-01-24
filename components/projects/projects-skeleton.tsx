"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ColumnDef } from "@tanstack/table-core"

interface ProjectsSkeletonProps {
  columns: ColumnDef<any>[]
}

export function ProjectsSkeleton({ columns }: ProjectsSkeletonProps) {
  const getColumnWidth = (column: ColumnDef<any>) => {
    return column.meta?.width || 'w-[150px]'
  }

  return (
    <div>
      <div className="flex items-center gap-8 gap-y-4 sm:justify-between justify-center flex-wrap">
        <h2 className="text-3xl font-bold tracking-tight">Projeler</h2>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Proje
        </Button>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Ara..."
          className="max-w-sm bg-white"
        />
      </div>

      <div className="relative rounded-md border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead 
                    key={index} 
                    className={getColumnWidth(column)}
                  >
                    {column.header?.toString()}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map((column, index) => (
                    <TableCell 
                      key={index + "row"} 
                      className={getColumnWidth(column)}
                    >
                      <Skeleton className={`h-4 ${column.id === 'actions' ? 'h-8 w-8 rounded-md' : 'w-[90%]'}`} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" disabled>
          Önceki
        </Button>
        <Button variant="outline" size="sm" disabled>
          Sonraki
        </Button>
      </div>
    </div>
  )
} 