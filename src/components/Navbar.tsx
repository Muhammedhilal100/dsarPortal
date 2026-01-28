import Link from "next/link"
import { auth } from "@/auth"
import { signOut } from "@/auth"
import ConditionalNavbar from "./ConditionalNavbar"

export default async function Navbar() {
  const session = await auth()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="group flex items-center gap-2 transition-all">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-600 text-white ">
              <span className="font-bold">D</span>
            </div>
            <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">DSAR<span className="text-lime-600">Portal</span></span>
          </div>
        </div>
        <ConditionalNavbar>
          <div className="flex items-center gap-4">
            {!session ? (
              <>
                <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-emerald-950 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900 dark:bg-lime-500 dark:text-emerald-950 dark:hover:bg-lime-400 shadow-sm transition-colors"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={(session.user as any).role === 'ADMIN' ? '/admin' : '/owner'}
                  className="text-sm font-black text-zinc-600 hover:text-lime-600 dark:text-zinc-400 dark:hover:text-lime-400"
                >
                  Dashboard
                </Link>
                {(session.user as any).role === 'OWNER' && (
                  <Link
                    href="/owner/profile"
                    className="text-sm font-black text-zinc-600 hover:text-lime-600 dark:text-zinc-400 dark:hover:text-lime-400"
                  >
                    Profile
                  </Link>
                )}
                <form action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/" })
                }}>
                  <button className="text-sm font-medium text-red-500 hover:text-red-600">
                    Logout
                  </button>
                </form>
              </>
            )}
          </div>
        </ConditionalNavbar>
      </div>
    </nav>
  )
}
