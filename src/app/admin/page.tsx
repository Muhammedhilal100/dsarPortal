import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import DashboardTabs from "@/components/DashboardTabs"
import PageTransition from "@/components/PageTransition"
import { updateCompanyStatus } from "@/app/actions/admin"
import { updateDsarStatus, contactRequester } from "@/app/actions/dsar"
import { 
  Building2, 
  ShieldCheck, 
  Users, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Search,
  CircleDot,
  Mail,
  ArrowRight,
  ArrowUpRight,
  Check,
  X,
  ShieldAlert
} from "lucide-react"

async function handleCompanyUpdate(formData: FormData) {
  "use server"
  const companyId = formData.get("companyId") as string
  const status = formData.get("status") as "APPROVED" | "REJECTED"
  await updateCompanyStatus(companyId, status)
}

async function handleDsarUpdate(formData: FormData) {
  "use server"
  const dsarId = formData.get("dsarId") as string
  const status = formData.get("status") as any
  await updateDsarStatus(dsarId, status)
}

async function handleContact(formData: FormData) {
  "use server"
  const dsarId = formData.get("dsarId") as string
  const message = formData.get("message") as string
  await contactRequester(dsarId, message)
}

export default async function AdminDashboard({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ page?: string; status?: string }>
}) {
  const searchParams = await searchParamsPromise
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login")
  }

  const page = parseInt(searchParams.page || "1")
  const limit = 10
  const skip = (page - 1) * limit
  const statusFilter = searchParams.status

  const [pendingCompanies, allCompanies, dsarData, stats] = await Promise.all([
    prisma.company.findMany({
      where: { status: "PENDING" },
      include: { owner: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.company.findMany({
      include: { owner: true },
      orderBy: { createdAt: 'desc' }
    }),
    (async () => {
      const dsarWhere = statusFilter ? { status: statusFilter } : {}
      const [requests, count] = await Promise.all([
        prisma.dsarRequest.findMany({
          where: dsarWhere,
          include: { company: true },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.dsarRequest.count({ where: dsarWhere }),
      ])
      return { requests, count }
    })(),
    (async () => {
      const [totalC, totalD, openD] = await Promise.all([
        prisma.company.count(),
        prisma.dsarRequest.count(),
        prisma.dsarRequest.count({ where: { status: 'OPEN' } })
      ])
      return { totalC, totalD, openD }
    })()
  ])

  const totalPages = Math.ceil(dsarData.count / limit)

  return (
    <div className="min-h-screen bg-white p-8 dark:bg-emerald-950">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_15%,rgba(163,230,53,0.03)_0%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(45%_45%_at_50%_15%,rgba(16,185,129,0.05)_0%,rgba(2,44,34,0)_100%)]" />

      <div className="mx-auto max-w-7xl">
        <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-600 text-white shadow-xl shadow-emerald-600/20">
              <span className="text-xl font-black">D</span>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">DSAR<span className="text-lime-600">Portal</span> <span className="ml-2 rounded-lg bg-zinc-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:bg-zinc-800">Admin</span></h1>
              <p className="mt-1 text-sm font-medium text-zinc-500">The complete solution for managing privacy requests.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-3 pr-6 dark:border-zinc-800 dark:bg-zinc-900/50">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-600 text-white shadow-lg shadow-emerald-600/20">
                <Users className="h-5 w-5" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Logged In As</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">{session.user?.email}</p>
             </div>
          </div>
        </header>

        {/* Stats Section */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Companies", value: stats.totalC, icon: Building2, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Total DSARs", value: stats.totalD, icon: FileText, color: "text-lime-600", bg: "bg-lime-50" },
              { label: "Open Requests", value: stats.openD, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Pending Reviews", value: pendingCompanies.length, icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50" }
            ].map((stat, i) => (
              <div key={i} className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:shadow-none">
                 <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} dark:bg-zinc-800`}>
                    <stat.icon className="h-6 w-6" />
                 </div>
                 <p className="text-xs font-black uppercase tracking-widest text-zinc-400">{stat.label}</p>
                 <p className="mt-1 text-3xl font-black tracking-tight text-zinc-900 dark:text-white">{stat.value}</p>
              </div>
            ))}
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* Pending Reviews */}
          <section>
            <div className="mb-6 flex items-center gap-3">
               <div className="h-8 w-1 bg-lime-600 rounded-full" />
               <h2 className="text-2xl font-black tracking-tight">Pending Reviews</h2>
            </div>
            {pendingCompanies.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-100 py-12 dark:border-zinc-800">
                <p className="font-bold text-zinc-400 uppercase tracking-widest text-xs">No pending applications</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pendingCompanies.map((company) => (
                  <div key={company.id} className="group rounded-3xl border border-zinc-100 bg-white p-6 shadow-xl shadow-zinc-200/50 transition-all hover:border-lime-200 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <div className="mb-6 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 font-black text-emerald-600 dark:bg-zinc-800">
                        {company.name.charAt(0)}
                      </div>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-tight text-amber-600 dark:bg-amber-900/20">
                        PENDING
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-zinc-900 dark:text-white">{company.name}</h3>
                      <p className="text-xs text-zinc-500">{company.email}</p>
                    </div>
                    <div className="my-6 space-y-2 rounded-2xl bg-zinc-50 p-4 text-[11px] font-bold dark:bg-zinc-800/50">
                      <div className="flex justify-between"><span className="text-zinc-400 uppercase">Field</span><span>{company.field}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-400 uppercase">Headcount</span><span>{company.employeesCount}</span></div>
                      <div className="flex justify-between"><span className="text-zinc-400 uppercase">Region</span><span>{company.representation}</span></div>
                    </div>
                    <div className="flex gap-3">
                      <form action={handleCompanyUpdate} className="flex-1">
                        <input type="hidden" name="companyId" value={company.id} />
                        <input type="hidden" name="status" value="APPROVED" />
                        <button type="submit" className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-lime-600 py-3 text-xs font-black text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed">
                          <Check className="h-4 w-4" /> Approve
                        </button>
                      </form>
                      <form action={handleCompanyUpdate} className="flex-1">
                        <input type="hidden" name="companyId" value={company.id} />
                        <input type="hidden" name="status" value="REJECTED" />
                        <button type="submit" className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-zinc-100 py-3 text-xs font-black text-zinc-600 transition-all hover:bg-red-600 hover:text-white dark:bg-zinc-800 dark:text-zinc-400 active:scale-95 text-center disabled:cursor-not-allowed">
                          <X className="h-4 w-4" /> Reject
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* DSAR Requests */}
          <section>
            <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Global Requests</h2>
                  <p className="text-sm text-zinc-500">Cross-company monitoring</p>
                </div>
                <DashboardTabs 
                  basePath="/admin"
                  tabs={[
                    { label: "All", value: null },
                    { label: "Open", value: "OPEN" },
                    { label: "In Progress", value: "IN_PROGRESS" },
                    { label: "In Review", value: "IN_REVIEW" },
                    { label: "Closed", value: "CLOSED" }
                  ]}
                />
              </div>

              <PageTransition key={statusFilter || 'all'}>
                <div className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50/50 dark:bg-zinc-800/30">
                      <tr>
                        <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-[10px]">Portal</th>
                        <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-[10px]">Requester</th>
                        <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-[10px]">Details</th>
                        <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-[10px]">Status</th>
                        <th className="px-6 py-4 text-right font-black uppercase tracking-widest text-zinc-400 text-[10px]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {dsarData.requests.map((req: any) => (
                        <tr key={req.id} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                          <td className="px-6 py-5">
                            <div className="font-bold text-zinc-900 dark:text-white">{req.company.name}</div>
                            <div className="text-[10px] uppercase font-black tracking-tight text-emerald-600">{req.company.slug}</div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="font-bold text-zinc-900 dark:text-white">{req.requesterName}</div>
                            <div className="text-xs text-zinc-500">{req.requesterEmail}</div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="max-w-xs text-xs text-zinc-500 leading-relaxed italic" title={req.requestText}>
                              "{req.requestText.length > 50 ? req.requestText.substring(0, 50) + '...' : req.requestText}"
                            </div>
                          </td>
                          <td className="px-6 py-5">
                             <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-tight ${
                                req.status === 'OPEN' ? 'border-amber-100 bg-amber-50 text-amber-600 dark:border-amber-900/30 dark:bg-amber-900/20' :
                                req.status === 'IN_PROGRESS' ? 'border-emerald-100 bg-emerald-50 text-emerald-600' :
                                req.status === 'IN_REVIEW' ? 'border-lime-100 bg-lime-50 text-lime-600' :
                                'border-zinc-200 bg-zinc-100 text-zinc-500'
                             }`}>
                                <CircleDot className="h-3 w-3" />
                                {req.status.replace('_', ' ')}
                              </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                               <div className="flex justify-end gap-2">
                                 <a 
                                   href={`mailto:${req.requesterEmail}?subject=Regarding your DSAR request #${req.id}&body=Hello ${req.requesterName},%0D%0A%0D%0AWe are contacting you regarding your privacy request...`}
                                   className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[10px] font-black hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                                 >
                                   <Mail className="h-3 w-3" /> Contact
                                 </a>
                                 {req.status === 'OPEN' && (
                                   <form action={handleDsarUpdate}>
                                     <input type="hidden" name="dsarId" value={req.id} />
                                     <input type="hidden" name="status" value="IN_PROGRESS" />
                                     <button type="submit" className="cursor-pointer rounded-lg bg-lime-400 px-4 py-2 text-[10px] font-black text-emerald-950 transition-all hover:bg-lime-300 active:scale-95 shadow-lg shadow-lime-500/10 disabled:cursor-not-allowed">
                                       Start
                                     </button>
                                   </form>
                                 )}
                                 {req.status === 'IN_PROGRESS' && (
                                   <form action={handleDsarUpdate}>
                                     <input type="hidden" name="dsarId" value={req.id} />
                                     <input type="hidden" name="status" value="IN_REVIEW" />
                                     <button type="submit" className="cursor-pointer rounded-lg bg-lime-600 px-4 py-2 text-[10px] font-black text-white transition-all hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-600/10 disabled:cursor-not-allowed">
                                       Review
                                     </button>
                                   </form>
                                 )}
                                 {req.status === 'IN_REVIEW' && (
                                   <form action={handleDsarUpdate}>
                                     <input type="hidden" name="dsarId" value={req.id} />
                                     <input type="hidden" name="status" value="CLOSED" />
                                     <button type="submit" className="cursor-pointer rounded-lg bg-lime-600 px-4 py-2 text-[10px] font-black text-white transition-all hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-600/10 disabled:cursor-not-allowed">
                                       Finalize
                                     </button>
                                   </form>
                                 )}
                                 {req.status === 'CLOSED' && (
                                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">Resolved</span>
                                 )}
                               </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-6 dark:border-zinc-800">
                    <p className="text-xs font-bold text-zinc-400">Page {page} of {totalPages}</p>
                    <div className="flex gap-2">
                      {page > 1 && <Link href={`/admin?page=${page - 1}${statusFilter ? `&status=${statusFilter}` : ''}`} className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-bold transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">Previous</Link>}
                      {page < totalPages && <Link href={`/admin?page=${page + 1}${statusFilter ? `&status=${statusFilter}` : ''}`} className="rounded-xl bg-emerald-950 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-900 dark:bg-emerald-800">Next</Link>}
                    </div>
                  </div>
                )}
              </PageTransition>
            </div>
          </section>

          {/* All Companies */}
          <section>
            <div className="mb-6 flex items-center gap-3">
               <div className="h-8 w-1 bg-zinc-900 rounded-full dark:bg-white" />
               <h2 className="text-2xl font-black tracking-tight">Active Ecosystem</h2>
            </div>
            <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50/50 dark:bg-zinc-800/30">
                  <tr>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-[10px]">Enterprise</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-[10px]">Ownership</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-[10px]">Verification</th>
                    <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-[10px]">Plan</th>
                    <th className="px-6 py-4 text-right font-black uppercase tracking-widest text-zinc-400 text-[10px]">Gateway</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {allCompanies.map((company) => (
                    <tr key={company.id} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                      <td className="px-6 py-5 font-bold text-zinc-900 dark:text-white">{company.name}</td>
                      <td className="px-6 py-5 text-zinc-500">{company.owner.email}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-tight ${
                          company.status === 'APPROVED' ? 'border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-900/20' :
                          company.status === 'REJECTED' ? 'border-red-100 bg-red-50 text-red-600' :
                          'border-amber-100 bg-amber-50 text-amber-600'
                        }`}>
                          {company.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5 text-xs font-bold capitalize">
                          <CheckCircle2 className={`h-3 w-3 ${company.subscriptionStatus === 'active' ? 'text-emerald-500' : 'text-zinc-300'}`} />
                          {company.subscriptionStatus}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {company.slug ? (
                          <a 
                            href={`/c/${company.slug}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-emerald-600 hover:underline"
                          >
                            Live Portal <ArrowUpRight className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-[10px] font-bold text-zinc-300">NO SLUG</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
