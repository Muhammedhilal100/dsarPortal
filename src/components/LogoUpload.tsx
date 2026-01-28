"use client"

import { useState, useRef } from "react"
import { Image as ImageIcon, X } from "lucide-react"

interface LogoUploadProps {
  name: string
  defaultValue?: string | null
}

export default function LogoUpload({ name, defaultValue }: LogoUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearFile = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Brand Logo</label>
        {preview && (
          <button
            type="button"
            onClick={clearFile}
            className="text-[10px] font-black uppercase tracking-tight text-red-500 hover:text-red-600"
          >
            Clear
          </button>
        )}
      </div>

      <div className="relative group overflow-hidden rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition-all hover:border-indigo-300 dark:border-zinc-800 dark:bg-black/50">
        {preview ? (
          <div className="relative aspect-video w-full">
            <img src={preview} alt="Logo Preview" className="h-full w-full object-contain p-4" />
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/40 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-zinc-900 shadow-xl"
              >
                Change Image
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor="logo-upload-input"
            className="flex h-32 w-full cursor-pointer flex-col items-center justify-center py-6"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <ImageIcon className="mb-3 h-8 w-8 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
              <p className="text-xs text-zinc-500 font-bold">Click to upload logo</p>
            </div>
          </label>
        )}
        <input
          id="logo-upload-input"
          ref={fileInputRef}
          name={name}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}
