"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import Link from "next/link"
import { useEffect, useState } from "react"

interface ProjectCardProps {
  project: any
  tasks: any[]
}

export function ProjectCard({ project, tasks }: ProjectCardProps) {
  // Client-side state'leri
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [totalTasks, setTotalTasks] = useState(0)
  const [completedTasks, setCompletedTasks] = useState(0)

  useEffect(() => {
    const total = tasks.length
    const completed = tasks.filter(task => task.status === 'COMPLETED').length
    const calculatedProgress = total > 0 ? (completed / total) * 100 : 0

    setTotalTasks(total)
    setCompletedTasks(completed)
    setProgress(calculatedProgress)
    setMounted(true)
  }, [tasks])

  if (!mounted) {
    return null
  }

  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>
            Son Tarih: {format(new Date(project.deadline), 'd MMM yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>İlerleme</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Görevler: {totalTasks}</span>
              <span>Tamamlanan: {completedTasks}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 