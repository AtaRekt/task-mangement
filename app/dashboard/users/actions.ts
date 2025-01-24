"use server"

import { db } from "@/db"
import { userTable } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { validateRequest } from "@/lib/validate-request"
import { hash } from "@node-rs/argon2"

export async function getUsers() {
  try {
    const { user } = await validateRequest()
    
    if (!user || user.role !== 1) {
      throw new Error("Unauthorized")
    }

    const users = await db.query.userTable.findMany({
      orderBy: [desc(userTable.createdAt)],
    })
    
    return users
  } catch (error) {
    console.error("Failed to fetch users:", error)
    throw new Error("Failed to fetch users")
  }
}

export async function updateUser(id: string, data: any) {
  try {
    const { user } = await validateRequest()
    
    if (!user || user.role !== 1) {
      throw new Error("Unauthorized")
    }

    const updateData: any = {
      name: data.name,
      email: data.email,
      role: parseInt(data.role),
    }

    // Şifre varsa güncelle
    if (data.password) {
      updateData.password_hash = await hash(data.password)
    }

    const updatedUser = await db.update(userTable)
      .set(updateData)
      .where(eq(userTable.id, id))
      .returning()

    revalidatePath("/dashboard/users")
    return updatedUser[0]
  } catch (error) {
    console.error("Failed to update user:", error)
    throw new Error("Failed to update user")
  }
}

export async function deleteUser(id: string) {
  try {
    const { user } = await validateRequest()
    
    if (!user || user.role !== 1) {
      throw new Error("Unauthorized")
    }

    // Kendini silmeye çalışıyorsa engelle
    if (user.id === id) {
      throw new Error("Cannot delete yourself")
    }

    const deleted = await db.delete(userTable)
      .where(eq(userTable.id, id))
      .returning()

    if (!deleted.length) {
      throw new Error("User not found")
    }

    revalidatePath("/dashboard/users")
    return deleted[0]
  } catch (error) {
    console.error("Failed to delete user:", error)
    throw error
  }
}

export async function createUser(data: any) {
  try {
    const { user } = await validateRequest()
    
    if (!user || user.role !== 1) {
      throw new Error("Unauthorized")
    }

    // E-posta kontrolü
    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.email, data.email.toLowerCase())
    })

    if (existingUser) {
      throw new Error("Email already exists")
    }

    const hashedPassword = await hash(data.password)

    const newUser = await db.insert(userTable)
      .values({
        name: data.name,
        email: data.email.toLowerCase(),
        password_hash: hashedPassword,
        role: parseInt(data.role),
      })
      .returning()

    revalidatePath("/dashboard/users")
    return newUser[0]
  } catch (error) {
    console.error("Failed to create user:", error)
    throw error
  }
} 