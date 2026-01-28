"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface Tab {
  label: string
  value: string | null
}

interface DashboardTabsProps {
  tabs: Tab[]
  basePath: string
}

export default function DashboardTabs({ tabs, basePath }: DashboardTabsProps) {
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get("status")

  return (
    <div className="flex flex-wrap gap-2 rounded-2xl bg-zinc-100 p-1.5 dark:bg-zinc-800">
      {tabs.map((tab) => {
        const isActive = (currentStatus === tab.value) || (!currentStatus && !tab.value)
        
        return (
          <Link
            key={tab.label}
            href={tab.value ? `${basePath}?status=${tab.value}` : basePath}
            scroll={false}
            className="relative rounded-xl px-5 py-2 text-xs font-bold transition-colors"
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl bg-white shadow-sm dark:bg-zinc-700"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className={`relative z-10 ${isActive ? "text-lime-600 dark:text-white" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"}`}>
              {tab.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
