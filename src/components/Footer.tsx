import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-600 text-white shadow-lg shadow-emerald-600/20">
                <span className="text-xl font-black">D</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">DSAR<span className="text-lime-600">Portal</span></span>
            </div>
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                The complete solution for managing Data Subject Access Requests with privacy and efficiency.
              </p>
            </div>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="flex flex-col gap-3">
              <p className="font-bold text-zinc-900 dark:text-white">Product</p>
              <Link href="#" className="text-zinc-500 hover:text-lime-600">Features</Link>
              <Link href="#" className="text-zinc-500 hover:text-lime-600">Pricing</Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-bold text-zinc-900 dark:text-white">Legal</p>
              <Link href="#" className="text-zinc-500 hover:text-lime-600">Privacy Policy</Link>
              <Link href="#" className="text-zinc-500 hover:text-lime-600">Terms of Service</Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-zinc-100 pt-8 dark:border-zinc-900">
          <p className="text-center text-xs text-zinc-400">
            &copy; {new Date().getFullYear()} DSAR Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
