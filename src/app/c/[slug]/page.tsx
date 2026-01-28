import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { submitDsar } from "@/app/actions/dsar"
import { ShieldCheck, Info, Globe, Send, CheckCircle2, Lock, ArrowRight, Building2, ShieldAlert } from "lucide-react"
import DynamicFavicon from "@/components/DynamicFavicon"
import { Metadata } from "next"

async function submitDsarAction(formData: FormData) {
  "use server"
  const companyId = formData.get("companyId") as string
  await submitDsar(companyId, formData)
}

interface PublicCompanyPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ success?: string }>
}

export async function generateMetadata({ params }: PublicCompanyPageProps): Promise<Metadata> {
  const { slug } = await params
  const company = await prisma.company.findUnique({
    where: { slug },
  })

  if (!company) {
    return {
      title: "Company Not Found",
    }
  }

  return {
    title: `${company.name} | Privacy Portal`,
    description: `Submit a Data Subject Access Request to ${company.name}.`,
    icons: {
      icon: company.logo || "/uploads/fav.png"
    }
  }
}

export default async function PublicCompanyPage({
  params: paramsPromise,
  searchParams: searchParamsPromise
}: PublicCompanyPageProps) {
  const params = await paramsPromise
  const searchParams = await searchParamsPromise

  const { slug } = params
  const isSuccess = searchParams.success === "true"

  const company = await prisma.company.findUnique({
    where: { slug },
  })

  if (!company || company.status !== "APPROVED") {
    notFound()
  }

  const isPortalActive = company.subscriptionStatus === "active" || company.subscriptionStatus === "trialing"

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <DynamicFavicon logoUrl={company.logo || "/uploads/fav.png"} />

      {/* Hero Background using pseudo-element style div */}
      <div className="absolute inset-x-0 top-0 h-[400px] w-full bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950" />

      <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Company Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white p-4 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:shadow-none dark:ring-zinc-800">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="h-full w-full object-contain" />
            ) : (
              <Building2 className="h-10 w-10 text-zinc-400" />
            )}
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">{company.name}</h1>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Privacy Portal
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              <Globe className="h-3.5 w-3.5" />
              {company.representation}
            </span>
          </div>
        </div>

        {isSuccess ? (
          <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:shadow-none dark:ring-zinc-800 text-center py-16">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Request Submitted Successfully</h2>
            <p className="mx-auto mt-4 max-w-md text-zinc-500">
              We have securely transmitted your request to {company.name}. You will receive a confirmation email shortly with your request reference ID.
            </p>
            <div className="mt-10">
              <a href={`/c/${slug}`} className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
                Submit Another Request
              </a>
            </div>
          </div>
        ) : (
          !isPortalActive ? (
            <div className="overflow-hidden rounded-3xl bg-white p-12 text-center shadow-xl shadow-zinc-200/50 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:shadow-none dark:ring-zinc-800">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Portal Unavailable</h2>
              <p className="mt-2 text-zinc-500">This privacy portal is currently inactive. Please contact the company directly.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-zinc-200/50 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:shadow-none dark:ring-zinc-800">
              <div className="bg-zinc-50/50 px-8 py-6 border-b border-zinc-100 dark:bg-zinc-800/50 dark:border-zinc-800">
                <h2 className="text-lg font-black text-zinc-900 dark:text-white">Submit Access Request</h2>
                <p className="text-sm text-zinc-500">Exercise your rights under GDPR, CCPA, and other privacy laws.</p>
              </div>

              <div className="p-8">
                <form action={submitDsarAction} className="space-y-6">
                  <input type="hidden" name="companyId" value={company.id} />

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Full Name</label>
                      <input name="name" required className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-3 text-sm font-medium transition-all focus:border-lime-500 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-950" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
                      <input name="email" type="email" required className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-3 text-sm font-medium transition-all focus:border-lime-500 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-950" placeholder="john@company.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Phone (Optional)</label>
                      <input name="phone" className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-3 text-sm font-medium transition-all focus:border-lime-500 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-950" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Request Details</label>
                    <textarea
                      name="requestDetails"
                      required
                      rows={5}
                      className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-3 text-sm font-medium transition-all focus:border-lime-500 focus:ring-0 dark:border-zinc-700 dark:bg-zinc-950"
                      placeholder="I would like to request a copy of all personal data held about me..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Identity Verification</label>
                    <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center transition-all hover:border-lime-500 dark:border-zinc-700 dark:bg-zinc-950">
                      <input name="attachments" type="file" multiple className="hidden" id="file-upload" />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                          <Info className="h-5 w-5 text-zinc-500" />
                        </div>
                        <p className="mt-2 text-sm font-bold text-zinc-600 dark:text-zinc-400">Click to upload documents</p>
                        <p className="mt-1 text-xs text-zinc-400">ID Card, Passport, or other proof (Max 5MB)</p>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="group flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-4 text-center text-sm font-black text-white transition-all hover:bg-zinc-800 active:scale-[0.98] dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
                      Send Request <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                    <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-zinc-400">
                      <Lock className="h-3 w-3" /> Secure 256-bit Encryption
                    </p>
                  </div>
                </form>
              </div>
            </div>
          )
        )}

        <div className="mt-10 text-center">
          <p className="text-xs text-zinc-400">Powered by <span className="font-bold text-zinc-500 dark:text-zinc-300">DSAR Portal</span></p>
        </div>
      </div>
    </div>
  )
}
