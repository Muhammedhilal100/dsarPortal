import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import DashboardTabs from "@/components/DashboardTabs"
import PageTransition from "@/components/PageTransition"
import RegisterCompanyForm from "@/components/RegisterCompanyForm"
import { createCompany, updateCompany } from "@/app/actions/company"
import { updateDsarStatus, contactRequester } from "@/app/actions/dsar"
import { createCheckoutSession } from "@/app/actions/stripe"
import {
  Building2,
  CreditCard,
  ExternalLink,
  ShieldCheck,
  LayoutDashboard,
  CircleDot,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Settings,
  Mail,
  User,
  FileText
} from "lucide-react"

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

async function handleCheckout() {
  "use server"
  await createCheckoutSession()
}

export default async function OwnerDashboard({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ page?: string; status?: string }>
}) {
  const searchParams = await searchParamsPromise
  const session = await auth()
  if (!session?.user?.id || (session.user as any).role !== "OWNER") {
    redirect("/login")
  }

  const page = parseInt(searchParams.page || "1")
  const limit = 5
  const skip = (page - 1) * limit
  const statusFilter = searchParams.status

  const company = await prisma.company.findUnique({
    where: { ownerId: session.user.id }
  })

  let dsarRequests: any[] = []
  let dsarCount = 0

  if (company) {
    const dsarWhere = {
      companyId: company.id,
      ...(statusFilter ? { status: statusFilter } : {})
    }

      ;[dsarRequests, dsarCount] = await Promise.all([
        prisma.dsarRequest.findMany({
          where: dsarWhere,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.dsarRequest.count({ where: dsarWhere }),
      ])
  }

  const totalPages = Math.ceil(dsarCount / limit)

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-emerald-950">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-600 text-white shadow-xl shadow-emerald-600/20">
              <span className="text-xl font-black">D</span>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">DSAR<span className="text-lime-600">Portal</span> <span className="ml-2 rounded-lg bg-zinc-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:bg-zinc-800">Workspace</span></h1>
              <p className="mt-1 text-sm font-medium text-zinc-500">The complete solution for managing privacy requests.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-3 pr-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-600 text-white shadow-lg shadow-emerald-600/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Owner Account</p>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">{session.user.email}</p>
            </div>
          </div>
        </header>

        {!company ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-200 bg-white p-10 shadow-2xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="mb-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-600 text-white shadow-lg shadow-emerald-600/20">
                <Building2 className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">Register Company</h2>
              <p className="mt-2 text-zinc-500">Set up your portal to start receiving DSARs</p>
            </div>
            <RegisterCompanyForm />
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Stats cards similar to Admin but specific to Owner */}
              {[
                { label: "Company Status", value: company.status, icon: ShieldCheck, color: company.status === 'APPROVED' ? 'text-emerald-600' : 'text-amber-600', bg: company.status === 'APPROVED' ? 'bg-emerald-50' : 'bg-amber-50' },
                { label: "Subscription", value: company.subscriptionStatus, icon: CreditCard, color: company.subscriptionStatus === 'active' ? 'text-lime-600' : 'text-zinc-400', bg: company.subscriptionStatus === 'active' ? 'bg-lime-50' : 'bg-zinc-50' },
                { label: "Portal Access", value: company.status === 'APPROVED' ? "Live" : "Inactive", icon: LayoutDashboard, color: company.status === 'APPROVED' ? "text-emerald-600" : "text-zinc-400", bg: company.status === 'APPROVED' ? "bg-emerald-50" : "bg-zinc-50" }
              ].map((stat, i) => (
                <div key={i} className="group relative overflow-hidden rounded-3xl border border-zinc-100 bg-white p-8 shadow-xl shadow-zinc-200/50 transition-all hover:border-lime-200 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} dark:bg-zinc-800 transition-transform group-hover:scale-110`}>
                    <stat.icon className="h-7 w-7" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{stat.label}</p>
                  <p className={`mt-2 text-2xl font-black tracking-tight ${stat.color}`}>{stat.value}</p>

                  {i === 1 && company.subscriptionStatus !== 'active' && (
                    <form action={handleCheckout} className="mt-4">
                      <button className="flex cursor-pointer items-center gap-1.5 text-xs font-black text-lime-600 hover:underline">
                        Upgrade Account <ArrowRight className="h-3 w-3" />
                      </button>
                    </form>
                  )}
                  {i === 2 && company.status === 'APPROVED' && company.slug && (
                    <a href={`/c/${company.slug}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs font-black text-lime-600 hover:underline">
                      View Portal <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">DSAR Requests</h2>
                  <p className="text-sm text-zinc-500">Manage subject access requests</p>
                </div>
                <DashboardTabs
                  basePath="/owner"
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
                {dsarRequests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-100 py-20 dark:border-zinc-800">
                    <p className="font-bold text-zinc-400 uppercase tracking-widest text-xs">No requests currently active</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50/50 dark:bg-zinc-800/30">
                          <tr>
                            <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-[10px]">Requester</th>
                            <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-[10px]">Details</th>
                            <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-[10px]">Data</th>
                            <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-[10px]">Status</th>
                            <th className="px-6 py-4 text-right font-black uppercase tracking-widest text-zinc-400 text-[10px]">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                          {dsarRequests.map((req: any) => (
                            <tr key={req.id} className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                              <td className="px-6 py-5">
                                <div className="font-bold text-zinc-900 dark:text-white">{req.requesterName}</div>
                                <div className="text-xs text-zinc-500">{req.requesterEmail}</div>
                                {req.requesterPhone && <div className="text-xs text-zinc-400">{req.requesterPhone}</div>}
                              </td>
                              <td className="px-6 py-5">
                                <div className="max-w-xs text-xs text-zinc-500 leading-relaxed italic" title={req.requestText}>
                                  "{req.requestText.length > 50 ? req.requestText.substring(0, 50) + '...' : req.requestText}"
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                {req.attachments ? (
                                  <div className="flex flex-wrap gap-2">
                                    {req.attachments.split(",").map((path: string, idx: number) => {
                                      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(path);
                                      return (
                                        <a
                                          key={idx}
                                          href={path}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="group flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white p-1 hover:border-lime-500 dark:border-zinc-700 dark:bg-zinc-800"
                                          title="View file"
                                        >
                                          {isImage ? (
                                            <img src={path} alt={`Attachment ${idx + 1}`} className="h-8 w-8 rounded-md object-cover" />
                                          ) : (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-zinc-500 dark:bg-zinc-700">
                                              <FileText className="h-4 w-4" />
                                            </div>
                                          )}
                                          <span className="sr-only">View File {idx + 1}</span>
                                        </a>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <span className="text-[10px] font-bold text-zinc-300">None</span>
                                )}
                              </td>
                              <td className="px-6 py-5">
                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-tight ${req.status === 'OPEN' ? 'border-amber-100 bg-amber-50 text-amber-600 dark:border-amber-900/30 dark:bg-amber-900/20' :
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
                                      <button className="rounded-lg bg-lime-400 px-4 py-2 text-[10px] font-black text-emerald-950 transition-all hover:bg-lime-300 active:scale-95 shadow-lg shadow-lime-500/10">
                                        Start
                                      </button>
                                    </form>
                                  )}
                                  {req.status === 'IN_PROGRESS' && (
                                    <form action={handleDsarUpdate}>
                                      <input type="hidden" name="dsarId" value={req.id} />
                                      <input type="hidden" name="status" value="IN_REVIEW" />
                                      <button className="rounded-lg bg-lime-600 px-4 py-2 text-[10px] font-black text-white transition-all hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-600/10">
                                        Review
                                      </button>
                                    </form>
                                  )}
                                  {req.status === 'IN_REVIEW' && (
                                    <form action={handleDsarUpdate}>
                                      <input type="hidden" name="dsarId" value={req.id} />
                                      <input type="hidden" name="status" value="CLOSED" />
                                      <button className="rounded-lg bg-lime-600 px-4 py-2 text-[10px] font-black text-white transition-all hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-600/10">
                                        Close
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
                          {page > 1 && (
                            <Link href={`/owner?page=${page - 1}${statusFilter ? `&status=${statusFilter}` : ''}`} className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-bold transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
                              Previous
                            </Link>
                          )}
                          {page < totalPages && (
                            <Link href={`/owner?page=${page + 1}${statusFilter ? `&status=${statusFilter}` : ''}`} className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-zinc-700 dark:bg-indigo-600">
                              Next
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </PageTransition>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
