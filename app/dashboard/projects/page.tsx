import { validateRequest } from "@/lib/validate-request";
import { redirect } from "next/navigation";
import { ProjectsClient } from "@/components/projects/client";
import { ProjectsSkeleton } from "@/components/projects/projects-skeleton";
import { Suspense } from "react";
import { columns } from "@/components/projects/columns";

export default async function ProjectsPage() {
  const { user } = await validateRequest();

  if (!user || user.role !== 1) {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div>
        <Suspense fallback={<ProjectsSkeleton columns={columns} />}>
          <ProjectsClient />
        </Suspense>
      </div>
    </div>
  );
} 