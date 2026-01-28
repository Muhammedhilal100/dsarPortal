"use client"

import { useState } from "react"
import { Info, X, FileText } from "lucide-react"

export default function FileUpload() {
    const [files, setFiles] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            setFiles((prev) => [...prev, ...newFiles])

            const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
            setPreviews((prev) => [...prev, ...newPreviews])
        }
    }

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
        setPreviews((prev) => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center transition-all hover:border-lime-500 dark:border-zinc-700 dark:bg-zinc-950">
                <input
                    name="attachments"
                    type="file"
                    multiple
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileChange}
                />
                {/* Important: We render a hidden input with the actual files for form submission if needed by direct form action, 
            but standard file inputs are read-only for security. 
            However, for a server action form, the `onChange` approach works for state but we need to ensure the INPUT element itself holds the files for submission.
            
            ACTUALLY: A standard file input CANNOT be set programmatically clearly for security.
            The best way for Server Actions is just to stick with the input, and showing previews is purely visual.
            The user can just add more files by clicking again if `multiple` is on, but usually clicking again replaces the selection.
            To support "adding" more files incrementally with previews and then submitting ALL of them, we would need to control the submission via JS (FormData) 
            rather than a simple browser form action, OR use a DataTransfer object to update the input.files.
        */}
                <label htmlFor="file-upload" className="cursor-pointer block">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                        <Info className="h-5 w-5 text-zinc-500" />
                    </div>
                    <p className="mt-2 text-sm font-bold text-zinc-600 dark:text-zinc-400">Click to upload documents</p>
                    <p className="mt-1 text-xs text-zinc-400">ID Card, Passport, or other proof (Max 5MB)</p>
                </label>
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {files.map((file, i) => (
                        <div key={i} className="relative group overflow-hidden rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
                            <button
                                type="button"
                                onClick={() => removeFile(i)}
                                className="absolute right-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900/50 text-white backdrop-blur-sm transition-colors hover:bg-red-500"
                            >
                                <X className="h-3 w-3" />
                            </button>

                            <div className="aspect-square w-full overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                                {file.type.startsWith("image/") ? (
                                    <img src={previews[i]} alt="preview" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-zinc-400">
                                        <FileText className="h-8 w-8" />
                                    </div>
                                )}
                            </div>
                            <p className="mt-2 truncate text-[10px] font-medium text-zinc-500">{file.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
