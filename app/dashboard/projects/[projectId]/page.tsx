import { validateRequest } from "@/lib/validate-request"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { projectTable, taskTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { KanbanBoard } from "@/components/projects/kanban-board"

export default async function ProjectPage({
  params
}: {
  params: { projectId: string }
}) {
  const { user } = await validateRequest()

  if (!user) {
    redirect("/login")
  }

  const project = await db.query.projectTable.findFirst({
    where: eq(projectTable.id, params.projectId),
  })

  if (!project) {
    redirect("/dashboard")
  }

  const tasks = await db.query.taskTable.findMany({
    where: eq(taskTable.projectId, params.projectId),
    with: {
      user: true
    }
  })

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
      </div>
      <KanbanBoard project={project} tasks={tasks} />
    </div>
  )
} 