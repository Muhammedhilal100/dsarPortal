"use client"

import { updateCompany } from "@/app/actions/company"
import { Building2, Mail, Phone, Users, MapPin, Briefcase, Globe } from "lucide-react"
import LogoUpload from "@/components/LogoUpload"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface ProfileFormProps {
  company: any
}

export default function ProfileForm({ company }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await updateCompany(formData)
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
      className="grid grid-cols-1 gap-8 md:grid-cols-2"
    >
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400">
          <Building2 className="h-3 w-3" /> Company Name
        </label>
        <input 
          name="name" 
          defaultValue={company.name} 
          required 
          disabled={loading}
          className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-4 font-bold transition-all focus:border-lime-500 focus:ring-0 dark:border-zinc-800 dark:bg-black disabled:opacity-50" 
        />
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400">
          <Mail className="h-3 w-3" /> Work Email (Locked)
        </label>
        <input 
          disabled 
          value={company.email || ''} 
          className="w-full cursor-not-allowed rounded-xl border-zinc-100 bg-zinc-100 p-4 font-bold text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950" 
        />
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400">
          <Phone className="h-3 w-3" /> Contact Phone
        </label>
        <input 
          name="phone" 
          defaultValue={company.phone || ''} 
          disabled={loading}
          className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-4 font-bold transition-all focus:border-lime-500 focus:ring-0 dark:border-zinc-800 dark:bg-black disabled:opacity-50" 
        />
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400">
          <Users className="h-3 w-3" /> Employee Count
        </label>
        <input 
          name="employeesCount" 
          type="number" 
          defaultValue={company.employeesCount || ''} 
          disabled={loading}
          className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-4 font-bold transition-all focus:border-lime-500 focus:ring-0 dark:border-zinc-800 dark:bg-black disabled:opacity-50" 
        />
      </div>

      <div className="space-y-3 md:col-span-2">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400">
          <MapPin className="h-3 w-3" /> Headquarters Address
        </label>
        <input 
          name="address" 
          defaultValue={company.address || ''} 
          disabled={loading}
          className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-4 font-bold transition-all focus:border-lime-500 focus:ring-0 dark:border-zinc-800 dark:bg-black disabled:opacity-50" 
        />
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400">
          <Briefcase className="h-3 w-3" /> Industry Field
        </label>
        <input 
          name="field" 
          defaultValue={company.field || ''} 
          disabled={loading}
          className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-4 font-bold transition-all focus:border-lime-500 focus:ring-0 dark:border-zinc-800 dark:bg-black disabled:opacity-50" 
        />
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400">
          <Globe className="h-3 w-3" /> Regional Representation
        </label>
        <select 
          name="representation" 
          defaultValue={company.representation} 
          disabled={loading}
          className="w-full rounded-xl border-zinc-200 bg-zinc-50 p-4 font-bold transition-all focus:border-lime-500 focus:ring-0 dark:border-zinc-800 dark:bg-black disabled:opacity-50"
        >
          <option value="EU">European Union (EU)</option>
          <option value="UK">United Kingdom (UK)</option>
          <option value="EU_UK">Both EU & UK</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <LogoUpload name="logo" defaultValue={company.logo} />
      </div>

      <div className="pt-6 md:col-span-2">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full rounded-2xl bg-lime-400 py-5 text-lg font-black text-emerald-950 transition-all hover:bg-lime-300 active:scale-[0.98] shadow-2xl shadow-lime-500/10 dark:bg-lime-500 dark:text-emerald-950 disabled:opacity-50"
        >
          {loading ? "Syncing..." : "Sync Profile Details"}
        </button>
      </div>
    </form>
  )
}
