"use server"

import { db } from "@/db"
import { taskTable } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { validateRequest } from "@/lib/validate-request"

export async function createTask(data: any) {
  const { user } = await validateRequest()
  
  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.insert(taskTable).values({
    ...data,
    order: 0
  })
  revalidatePath("/dashboard/tasks")
}

export async function updateTask(id: string, data: any) {
  const { user } = await validateRequest()
  
  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.update(taskTable)
    .set(data)
    .where(eq(taskTable.id, id))
  revalidatePath("/dashboard/tasks")
}

export async function updateTaskStatus(id: string, status: string) {
  const { user } = await validateRequest()
  
  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.update(taskTable)
    .set({ status: status as "TODO" | "IN_PROGRESS" | "COMPLETED" })
    .where(eq(taskTable.id, id))
  revalidatePath("/dashboard/tasks")
}

export async function deleteTask(id: string) {
  const { user } = await validateRequest()
  
  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.delete(taskTable)
    .where(eq(taskTable.id, id))
  revalidatePath("/dashboard/tasks")
}

export async function getTasks() {
  const { user } = await validateRequest()
  
  if (!user) {
    throw new Error("Unauthorized")
  }

  try {
    const tasks = await db.query.taskTable.findMany({
      where: user.role === 1 ? undefined : eq(taskTable.userId, user.id),
      orderBy: [desc(taskTable.createdAt)],
      with: {
        user: true,
        project: true
      }
    })
    
    return tasks
  } catch (error) {
    console.error("Error fetching tasks:", error)
    throw new Error("FETCH_FAILED")
  }
} 