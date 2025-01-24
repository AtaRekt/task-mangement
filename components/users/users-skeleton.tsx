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

interface UsersSkeletonProps {
    columns: ColumnDef<any>[]
}

export function UsersSkeleton({ columns }: UsersSkeletonProps) {
    // Sütun genişliklerini belirle
    const getColumnWidth = (column: ColumnDef<any>) => {
        return column.meta?.width || 'w-[150px]'
    }

    return (
        <div>
            <div className="flex items-center gap-8 gap-y-4 sm:justify-between justify-center flex-wrap">
                <h2 className="text-3xl font-bold tracking-tight">Kullanıcılar</h2>
                <Button disabled>
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Kullanıcı
                </Button>
            </div>

            {/* Search input */}
            <div className="flex items-center py-4">
                <Input
                    placeholder="Ara..."
                    className="max-w-sm bg-white"
                />
            </div>

            {/* Table */}
            <div className="relative rounded-md border bg-white shadow-sm !mt-0">
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
                            {[...Array(5)].map((_, rowIndex) => (
                                <TableRow key={`row-${rowIndex}`}>
                                    {columns.map((column, colIndex) => (
                                        <TableCell 
                                            key={`${rowIndex}-${column.id ?? colIndex}`} 
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
        </div>
    )
} 