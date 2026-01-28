"use client"

import { createCompany } from "@/app/actions/company"
import { Building2 } from "lucide-react"
import LogoUpload from "@/components/LogoUpload"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterCompanyForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await createCompany(formData)
      if (result?.success) {
        router.refresh()
      }
    } catch (error) {
       console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit}
      encType="multipart/form-data" 
      className="grid grid-cols-1 gap-6 md:grid-cols-2"
    >
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Company Name</label>
        <input name="name" required disabled={loading} className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-black disabled:opacity-50" placeholder="Acme Inc" />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Work Email</label>
        <input name="email" type="email" required disabled={loading} className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-black disabled:opacity-50" placeholder="contact@acme.com" />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Phone</label>
        <input name="phone" disabled={loading} className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-black disabled:opacity-50" placeholder="+1 (555) 000-0000" />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Employees</label>
        <input name="employeesCount" type="number" disabled={loading} className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-black disabled:opacity-50" placeholder="50" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Headquarters</label>
        <input name="address" disabled={loading} className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-black disabled:opacity-50" placeholder="123 Silicon Valley, CA" />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Industry</label>
        <input name="field" disabled={loading} className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-black disabled:opacity-50" placeholder="Technology" />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Region</label>
        <select name="representation" disabled={loading} className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-black disabled:opacity-50">
          <option value="EU">EU Only</option>
          <option value="UK">UK Only</option>
          <option value="EU_UK">EU & UK</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <LogoUpload name="logo" />
      </div>
      <div className="pt-4 md:col-span-2">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full rounded-xl bg-lime-400 py-4 text-lg font-black text-emerald-950 transition-all hover:bg-lime-300 active:scale-95 shadow-xl shadow-lime-500/10 dark:bg-lime-500 dark:text-emerald-950 disabled:opacity-50"
        >
          {loading ? "Completing Setup..." : "Complete Setup"}
        </button>
      </div>
    </form>
  )
}
