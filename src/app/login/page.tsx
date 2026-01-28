"use client"

import Link from "next/link"
import { loginUser, resetPassword, checkUserExists } from "@/app/actions/auth"
import { Lock, Mail, ChevronLeft, Eye, EyeOff, AlertCircle, ShieldCheck, ArrowRight, KeyRound } from "lucide-react"
import { useState } from "react"

type View = "login" | "forgot-password" | "otp" | "reset"

export default function LoginPage() {
  const [view, setView] = useState<View>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  
  const PREDEFINED_OTP = "123456"

  async function handleLogin(formData: FormData) {
    if (loading) return
    setError(null)
    setLoading(true)
    
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const result = await loginUser(formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
      // If success, Next.js will handle the redirect
    } catch (err: any) {
      // Don't show error for Next.js redirects
      if (err.message === 'NEXT_REDIRECT' || (err.digest && err.digest.includes('NEXT_REDIRECT'))) {
        return
      }
      console.error(err)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  const handleForgotPasswordSubimt = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email")
      return
    }
    setError(null)
    setLoading(true)
    
    try {
        const exists = await checkUserExists(email)
        if (!exists) {
            setError("No account found with this email address")
            setLoading(false)
            return
        }

        // Simulate API call for OTP sending
        await new Promise(resolve => setTimeout(resolve, 800))
        
        setLoading(false)
        setView("otp")
    } catch (err) {
        setError("An unexpected error occurred. Please try again.")
        setLoading(false)
    }
  }

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 600))
    
    if (otp === PREDEFINED_OTP) {
        setError(null)
        setLoading(false)
        setView("reset")
    } else {
        setError("Invalid OTP. Try 123456")
        setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const password = (e.target as any).newPassword.value
    const confirm = (e.target as any).confirmPassword.value

    if (password !== confirm) {
        setError("Passwords do not match")
        return
    }

    if (password.length < 6) {
        setError("Password must be at least 6 characters")
        return
    }

    setError(null)
    setLoading(true)
    
    try {
        const result = await resetPassword(email, password)
        if (result.success) {
            alert("Password updated successfully!")
            setView("login")
        } else {
            setError(result.error || "Reset failed")
        }
    } catch (err) {
        setError("An unexpected error occurred")
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-white dark:bg-emerald-950">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(163,230,53,0.05)_0%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(45%_45%_at_50%_50%,rgba(16,185,129,0.05)_0%,rgba(2,44,34,0)_100%)]" />
      
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {view === "login" ? (
            <Link href="/" className="mb-10 flex items-center gap-2 text-zinc-500 transition-colors hover:text-lime-600">
                <ChevronLeft className="h-4 w-4" />
                <span className="text-sm font-semibold">Back to home</span>
            </Link>
          ) : (
            <button onClick={() => setView("login")} className="mb-10 flex items-center gap-2 text-zinc-500 transition-colors hover:text-lime-600">
                <ChevronLeft className="h-4 w-4" />
                <span className="text-sm font-semibold">Back to Login</span>
            </button>
          )}

          <div className="rounded-3xl border border-zinc-200 bg-white p-10 shadow-2xl shadow-zinc-200/50 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:shadow-none">
            
            {/* Login View */}
            {view === "login" && (
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

                <form action={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                      <input
                        name="email"
                        type="email"
                        required
                        disabled={loading}
                        className="w-full rounded-xl border-zinc-200 bg-zinc-50 py-4 pl-12 pr-4 transition-all focus:border-lime-500 focus:ring-0 dark:border-emerald-800 dark:bg-emerald-950/50 disabled:opacity-50"
                        placeholder="name@company.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Password</label>
                      <button type="button" onClick={() => setView("forgot-password")} className="text-xs font-bold text-lime-600 hover:underline">Forgot password?</button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        disabled={loading}
                        className="w-full rounded-xl border-zinc-200 bg-zinc-50 py-4 pl-12 pr-12 transition-all focus:border-lime-500 focus:ring-0 dark:border-emerald-800 dark:bg-emerald-950/50 disabled:opacity-50"
                        placeholder="••••••••"
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-lime-400 py-4 text-lg font-black text-emerald-950 shadow-xl shadow-lime-500/10 transition-all hover:bg-lime-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>
              </>
            )}

            {/* Forgot Password View */}
            {view === "forgot-password" && (
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

                <form onSubmit={handleForgotPasswordSubimt} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                required
                                disabled={loading}
                                className="w-full rounded-xl border-zinc-200 bg-zinc-50 py-4 pl-12 pr-4 transition-all focus:border-lime-500 focus:ring-0 dark:border-emerald-800 dark:bg-emerald-950/50 disabled:opacity-50"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-lime-400 py-4 text-lg font-black text-emerald-950 shadow-xl shadow-lime-500/10 transition-all hover:bg-lime-300 disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </form>
                </>
            )}

            {/* OTP Verification View */}
            {view === "otp" && (
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
                        {loading ? "Verifying..." : "Verify Code"}
                    </button>
                </form>
                </>
            )}

            {/* Reset Password View */}
            {view === "reset" && (
                <>
                <div className="mb-10 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-600 text-white shadow-lg shadow-emerald-600/20">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <h1 className="text-3xl font-black tracking-tight">Reset password</h1>
                  <p className="mt-2 text-zinc-500">Create a new secure password</p>
                </div>

                {error && (
                  <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                            <input
                                name="newPassword"
                                type="password"
                                required
                                disabled={loading}
                                className="w-full rounded-xl border-zinc-200 bg-zinc-50 py-4 pl-12 pr-4 transition-all focus:border-lime-500 focus:ring-0 dark:border-emerald-800 dark:bg-emerald-950 disabled:opacity-50"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                disabled={loading}
                                className="w-full rounded-xl border-zinc-200 bg-zinc-50 py-4 pl-12 pr-4 transition-all focus:border-lime-500 focus:ring-0 dark:border-emerald-800 dark:bg-emerald-950 disabled:opacity-50"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full rounded-xl bg-lime-400 py-4 text-lg font-black text-emerald-950 shadow-xl shadow-lime-500/10 transition-all hover:bg-lime-300 disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
                </>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-zinc-500">
                Don't have an account?{" "}
                <Link href="/register" className="font-bold text-lime-600 hover:underline">
                 Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
