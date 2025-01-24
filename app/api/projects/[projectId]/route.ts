import { db } from "@/db"
import { projectTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(
    request: Request,
    { params }: { params: { projectId: string } }
) {
    try {
        const project = await db.query.projectTable.findFirst({
            where: eq(projectTable.id, params.projectId),
        })

        if (!project) {
            return new NextResponse("Not found", { status: 404 })
        }

        return NextResponse.json(project)
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 })
    }
} 