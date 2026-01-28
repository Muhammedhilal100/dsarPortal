"use client"

import { usePathname } from "next/navigation"

export default function ConditionalNavbar({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Hide navbar on public company portal pages
    if (pathname?.startsWith('/c/')) {
        return null
    }

    return <>{children}</>
}
