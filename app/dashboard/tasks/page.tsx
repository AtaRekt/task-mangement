import { validateRequest } from "@/lib/validate-request";
import { redirect } from "next/navigation";
import { TasksClient } from "@/components/tasks/client";

export default async function TasksPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  if (user?.role !== 1) {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <TasksClient isAdmin={user.role === 1} />
    </div>
  );
} 