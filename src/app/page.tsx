import Link from "next/link"
import { Shield, Lock, FileCheck, CreditCard, ChevronRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-lime-100 selection:text-lime-700 dark:bg-emerald-950 dark:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-gradient-to-b from-lime-50/50 to-transparent dark:from-emerald-900/20" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-12 flex flex-col items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-600 text-white shadow-2xl shadow-emerald-600/20">
                  <span className="text-2xl font-black">D</span>
                </div>
                <span className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">DSAR<span className="text-lime-600">Portal</span></span>
              </div>
              <p className="max-w-md text-sm font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                The complete solution for privacy management.
              </p>
            </div>
            <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
              Modern DSAR Management for <span className="text-lime-600">Compliance First</span> Companies.
            </h1>
            <p className="mt-8 text-xl leading-8 text-zinc-600 dark:text-zinc-400">
              Stop managing data requests through messy emails. DSAR Portal provides a secure, automated, and streamlined way to handle privacy requests from your users.
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              <Link
                href="/register"
                className="rounded-full bg-lime-500 px-8 py-4 text-lg font-bold text-zinc-900 shadow-lg shadow-lime-500/20 transition-all hover:bg-lime-400 hover:scale-105 active:scale-95"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="group flex items-center gap-2 text-lg font-bold hover:text-lime-600"
              >
                Sign In <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 sm:py-32 bg-zinc-50 dark:bg-emerald-900/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-lime-600">Everything you need</h2>
            <p className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Powering compliance at scale.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-lg font-bold">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-600 text-white shadow-lg shadow-emerald-600/20">
                    <Lock className="h-6 w-6" />
                  </div>
                  Secure Public Portals
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  <p className="flex-auto">Deploy a branded, unique URL for your company. Users can submit requests without ever needing to log in.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-lg font-bold">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-600 text-white shadow-lg shadow-emerald-600/20">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  Automated Tracking
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  <p className="flex-auto">Real-time dashboards for owners and admins. Track status changes, response times, and compliance metrics.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-lg font-bold">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-600 text-white shadow-lg shadow-emerald-600/20">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  Flexible Subscriptions
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  <p className="flex-auto">Integrated Stripe billing ensures your portal is always active and compliant with effortless recurring payments.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 sm:py-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-lime-600">Process</h2>
            <p className="mt-2 text-3xl font-black tracking-tight sm:text-4xl text-zinc-900 dark:text-white">
              Compliance in three simple steps
            </p>
          </div>

          <div className="relative mx-auto max-w-5xl">
            {/* Connecting Line (Desktop) */}
            <div className="absolute top-1/2 left-0 hidden w-full -translate-y-1/2 md:block">
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-lime-200 to-transparent dark:via-lime-900/50" />
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {[
                { title: "Create Account", desc: "Sign up as a business owner and set up your organization profile.", step: "01" },
                { title: "Deploy Portal", desc: "Get your unique secure link instantly to share with your customers.", step: "02" },
                { title: "Automate", desc: "Receive and manage requests in your centralized dashboard.", step: "03" }
              ].map((item, i) => (
                <div key={i} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white border-2 border-lime-100 shadow-xl shadow-lime-500/10 dark:bg-zinc-900 dark:border-lime-900/30">
                    <span className="text-xl font-black text-lime-600">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-xs">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-emerald-950 px-6 py-24 shadow-2xl rounded-3xl sm:px-24 xl:py-32 border border-emerald-900">
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-black tracking-tight text-white sm:text-4xl">
              Ready to automate your DSAR workflow?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-8 text-emerald-100/70">
              Join hundreds of companies that trust DSAR Portal for their privacy compliance needs.
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              <Link
                href="/register"
                className="rounded-full bg-lime-400 px-8 py-3 text-sm font-black text-emerald-950 shadow-sm hover:bg-lime-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started
              </Link>
            </div>
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
              aria-hidden="true"
            >
              <circle cx={512} cy={512} r={512} fill="url(#gradient)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="gradient">
                  <stop stopColor="#a3e635" />
                  <stop offset={1} stopColor="#064e3b" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </section>
    </div>
  )
}
