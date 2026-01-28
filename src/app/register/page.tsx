"use client"

import { registerUser, checkUserExists } from "@/app/actions/auth"
import Link from "next/link"
import { ShieldCheck, Mail, Lock, ChevronLeft, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function RegisterPage() {
  const [view, setView] = useState<"form" | "otp">("form")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const PREDEFINED_OTP = "123456"

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setError(null)

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    try {
      // Check if user already exists
      const exists = await checkUserExists(email)
      if (exists) {
        setError("An account with this email already exists")
        setLoading(false)
        return
      }

      // If everything looks good, move to OTP view
      setLoading(false)
      setView("otp")
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)

    if (otp !== PREDEFINED_OTP) {
      setError("Invalid security code. Try 123456")
      setLoading(false)
      return
    }

    // OTP correct, perform registration
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)
    formData.append("role", "OWNER")

    try {
      const result = await registerUser(formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
      // If success, Next.js will handle the redirect to /login
    } catch (err: any) {
      if (err.message === 'NEXT_REDIRECT' || (err.digest && err.digest.includes('NEXT_REDIRECT'))) {
        return
      }
      setError("Failed to create account. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-emerald-950">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_15%,rgba(163,230,53,0.05)_0%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(45%_45%_at_50%_15%,rgba(16,185,129,0.05)_0%,rgba(2,44,34,0)_100%)]" />

      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {view === "form" ? (
            <Link 
              href="/"
              className="mb-10 flex items-center gap-2 text-zinc-500 transition-colors hover:text-lime-600"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm font-semibold">Back to home</span>
            </Link>
          ) : (
            <button 
              onClick={() => setView("form")}
              className="mb-10 flex items-center gap-2 text-zinc-500 transition-colors hover:text-lime-600"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm font-semibold">Back to form</span>
            </button>
          )}

          <div className="rounded-3xl border border-zinc-200 bg-white p-10 shadow-2xl shadow-zinc-200/50 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:shadow-none">
            
            {view === "form" ? (
              <>
                <div className="mb-10 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-600 text-white shadow-lg shadow-emerald-600/20">
                    <span className="text-2xl font-black">D</span>
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">DSAR<span className="text-lime-600">Portal</span></h1>
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-zinc-400">The complete solution for privacy management</p>
                </div>

                {error && (
                  <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleFormSubmit}>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Work Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        required
                        disabled={loading}
                        className="w-full rounded-xl border-zinc-200 bg-zinc-50 py-4 pl-12 pr-4 transition-all focus:border-lime-500 focus:ring-0 dark:border-emerald-800 dark:bg-emerald-950/50 disabled:opacity-50"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Secure Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        required
                        disabled={loading}
                        className="w-full rounded-xl border-zinc-200 bg-zinc-50 py-4 pl-12 pr-12 transition-all focus:border-lime-500 focus:ring-0 dark:border-emerald-800 dark:bg-emerald-950/50 disabled:opacity-50"
                        placeholder="Minimum 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input type="checkbox" required disabled={loading} className="mt-1 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-600 disabled:opacity-50" />
                    <p className="text-xs text-zinc-500">
                      I agree to the <Link href="#" className="font-bold text-zinc-900 underline dark:text-white">Terms of Service</Link> and <Link href="#" className="font-bold text-zinc-900 underline dark:text-white">Privacy Policy</Link>.
                    </p>
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className="group w-full rounded-xl bg-lime-400 py-4 text-lg font-black text-emerald-950 shadow-xl shadow-lime-500/10 transition-all hover:bg-lime-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {loading ? "Verifying..." : "Continue"} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-10 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-600 text-white shadow-lg shadow-emerald-600/20">
                    <span className="text-2xl font-black">D</span>
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">DSAR<span className="text-lime-600">Portal</span></h1>
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-zinc-400">The complete solution for privacy management</p>
                </div>

                {error && (
                  <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleOtpVerify} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Security Code</label>
                        <input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            disabled={loading}
                            maxLength={6}
                            className="w-full text-center text-3xl font-black tracking-[1em] rounded-xl border-zinc-200 bg-zinc-50 py-6 transition-all focus:border-lime-500 focus:ring-0 dark:border-emerald-800 dark:bg-emerald-950 disabled:opacity-50"
                            placeholder="------"
                        />
                        <p className="mt-4 text-center text-xs text-zinc-400">
                            Predefined OTP for testing: <span className="font-bold text-lime-600">{PREDEFINED_OTP}</span>
                        </p>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-lime-400 py-4 text-lg font-black text-emerald-950 shadow-xl shadow-lime-500/10 transition-all hover:bg-lime-300 disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Finalize Registration"}
                    </button>
                </form>
              </>
            )}

            <div className="mt-8 text-center text-sm">
              <p className="text-zinc-500">
                Already have a portal?{" "}
                <Link href="/login" className="font-bold text-lime-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
