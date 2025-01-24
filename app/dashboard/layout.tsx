import { redirect } from "next/navigation"
import Sidebar from "@/components/dashboard/sidebar"
import SecondaryNav from "@/components/dashboard/secondary-nav"
import { validateRequest } from "@/lib/validate-request";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-[100dvh]">
      <Sidebar user={user} />
      <div className="flex-1 bg-gray-100 w-full">
        <SecondaryNav user={{
          name: user.name,
          email: user.email,
          role: user.role
        }} />
        <main className="p-6 container mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
