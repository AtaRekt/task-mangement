"use server"

import { db } from "@/db"
import { projectTable } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { validateRequest } from "@/lib/validate-request"

export async function getProjects() {
  try {
    const projects = await db.query.projectTable.findMany({
      orderBy: [desc(projectTable.createdAt)],
    })
    
    return projects
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    throw new Error("Failed to fetch projects")
  }
}

export async function createProject(data: any) {
  try {
    const { user } = await validateRequest()
    
    if (!user || user.role !== 1) {
      throw new Error("Unauthorized")
    }

    const project = await db.insert(projectTable).values({
      name: data.name,
      description: data.description,
      deadline: data.deadline,
    }).returning()

    revalidatePath("/dashboard/projects")
    return project[0]
  } catch (error) {
    console.error("Failed to create project:", error)
    throw new Error("Failed to create project")
  }
}

export async function updateProject(id: string, data: any) {
  try {
    const { user } = await validateRequest()
    
    if (!user || user.role !== 1) {
      throw new Error("Unauthorized")
    }

    const project = await db.update(projectTable)
      .set(data)
      .where(eq(projectTable.id, id))
      .returning()

    revalidatePath("/dashboard/projects")
    return project[0]
  } catch (error) {
    console.error("Failed to update project:", error)
    throw new Error("Failed to update project")
  }
}

export async function deleteProject(id: string) {
  try {
    const { user } = await validateRequest()
    
    if (!user || user.role !== 1) {
      throw new Error("Unauthorized")
    }

    const deleted = await db.delete(projectTable)
      .where(eq(projectTable.id, id))
      .returning()

    if (!deleted.length) {
      throw new Error("Project not found")
    }

    return deleted[0]
  } catch (error) {
    console.error("Failed to delete project:", error)
    throw error
  }
} 