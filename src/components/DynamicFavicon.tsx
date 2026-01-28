"use client"

import { useEffect } from "react"

interface DynamicFaviconProps {
  logoUrl?: string | null
}

export default function DynamicFavicon({ logoUrl }: DynamicFaviconProps) {
  useEffect(() => {
    const updateIcons = (url: string) => {
      const rels = ['icon', 'shortcut icon', 'apple-touch-icon']
      rels.forEach(rel => {
        let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement
        if (!element) {
          element = document.createElement('link')
          element.rel = rel
          document.head.appendChild(element)
        }
        element.href = url
      })
    }

    if (logoUrl) {
      updateIcons(logoUrl)
    } else {
      updateIcons("/favicon.ico")
    }
  }, [logoUrl])

  return null
}
