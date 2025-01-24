import { validateRequest } from "@/lib/validate-request";
import { redirect } from "next/navigation";
import { UsersClient } from "@/components/users/client";

export default async function UsersPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  if (user?.role !== 1) {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 p-4 pt-6">
      <UsersClient />
    </div>
  );
} 