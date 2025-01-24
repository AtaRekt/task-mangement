"use client"

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useState, useEffect } from "react"
import { updateTaskStatus } from "@/app/dashboard/tasks/actions"

interface KanbanBoardProps {
  project: any
  tasks: any[]
}

const columns = [
  { id: 'TODO', title: 'Yapılacak' },
  { id: 'IN_PROGRESS', title: 'Devam Ediyor' },
  { id: 'COMPLETED', title: 'Tamamlandı' }
]

export function KanbanBoard({ project, tasks: initialTasks }: KanbanBoardProps) {
  const [mounted, setMounted] = useState(false)
  const [tasks, setTasks] = useState(initialTasks)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId === destination.droppableId) return

    // Update task status in UI
    const newTasks = [...tasks]
    const task = newTasks.find(t => t.id === draggableId)
    if (task) {
      task.status = destination.droppableId
      setTasks(newTasks)
    }

    // Update in database
    try {
      await updateTaskStatus(draggableId, destination.droppableId)
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(column => (
          <div key={column.id} className="space-y-4">
            <h3 className="font-medium text-lg">{column.title}</h3>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 min-h-[500px]"
                >
                  {tasks
                    .filter(task => task.status === column.id)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing"
                          >
                            <CardHeader>
                              <CardTitle className="text-base">{task.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-sm text-muted-foreground">
                                {task.description}
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                <Badge variant="outline">
                                  {task.user.name}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(task.deadline), 'd MMM')}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
} 