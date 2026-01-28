import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import ProfileForm from "@/components/ProfileForm"
import { Building2 } from "lucide-react"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id || (session.user as any).role !== "OWNER") {
    redirect("/login")
  }

  const company = await prisma.company.findUnique({
    where: { ownerId: session.user.id }
  })

  if (!company) {
    redirect("/owner")
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">Profile Settings</h1>
          <p className="mt-2 text-zinc-500">Manage your company's public identity and information</p>
        </header>

        <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-10 flex items-center gap-6">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 shadow-inner">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-400">
                  <Building2 className="h-10 w-10" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">{company.name}</h2>
              <p className="text-sm text-zinc-500 font-bold">{company.email}</p>
            </div>
          </div>

          <ProfileForm company={company} />
        </div>
      </div>
    </div>
  )
}
