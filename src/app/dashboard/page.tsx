import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const role = (session.user as any)?.role

  if (role === "ADMIN") {
    redirect("/admin")
  } else if (role === "OWNER") {
    redirect("/owner")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}
