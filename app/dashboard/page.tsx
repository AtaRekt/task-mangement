import { validateRequest } from "@/lib/validate-request";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { projectTable, taskTable } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { ProjectCard } from "@/components/dashboard/project-card";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { FolderIcon } from "lucide-react";
import { Suspense } from "react";

import { Playfair_Display } from "next/font/google";

// Loading component
function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="h-6 w-2/3 bg-muted rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-muted rounded animate-pulse mt-2" />
          </CardHeader>
          <div className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-2 w-full bg-muted rounded animate-pulse" />
              <div className="flex justify-between">
                <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  // Admin için tüm projeleri ve görevleri getir
  if (user.role === 1) {
    const projects = await db.query.projectTable.findMany({
      orderBy: [desc(projectTable.createdAt)]
    });

    const tasks = await db.query.taskTable.findMany({
      with: {
        project: true
      }
    });

    const projectTasks = projects.map(project => ({
      ...project,
      tasks: tasks.filter(task => task.projectId === project.id)
    }));

    if (projects.length === 0) {
      return (
        <div className="flex-1 space-y-4 p-4 pt-6">
          <h2 className="text-3xl font-bold tracking-tight">Tüm Projeler</h2>
          <Card className="flex flex-col items-center justify-center p-8 text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <FolderIcon className="h-12 w-12 text-muted-foreground" />
              </div>
              <CardDescription className="text-lg">
                Henüz hiç proje oluşturulmamış.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }

    return (
      <div className="flex-1 space-y-4 p-4 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Tüm Projeler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectTasks.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              tasks={project.tasks}
            />
          ))}
        </div>
      </div>
    );
  }

  // Normal kullanıcı için kendi görevlerinin olduğu projeleri getir
  const tasks = await db.query.taskTable.findMany({
    where: eq(taskTable.userId, user.id),
    with: {
      project: true
    }
  });

  const projectIds = tasks
    .filter(task => task.projectId && task.project)
    .map(task => task.projectId);

  if (projectIds.length === 0) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Projelerim</h2>
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <FolderIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardDescription className="text-lg">
              Henüz bir projede göreviniz bulunmuyor.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const projects = await db.query.projectTable.findMany({
    where: sql`${projectTable.id} IN ${projectIds}`,
    orderBy: [desc(projectTable.createdAt)]
  });

  const projectTasks = projects.map(project => ({
    ...project,
    tasks: tasks.filter(task => task.projectId === project.id)
  }));

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Projelerim</h2>
      <Suspense fallback={<ProjectsSkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectTasks.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              tasks={project.tasks}
            />
          ))}
        </div>
      </Suspense>
    </div>
  );
}
