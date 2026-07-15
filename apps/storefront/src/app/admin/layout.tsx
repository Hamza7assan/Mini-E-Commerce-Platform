"use client"
import { useAuthStore } from "@/store/useAuthStore"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { LayoutDashboard, ShoppingBag, LogOut, Package, FolderTree } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [isAuthenticated, pathname, router])

  if (!mounted) return null

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!isAuthenticated) return null

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-neutral-900 text-neutral-100 flex-shrink-0 flex flex-col">
        <div className="p-6 grow">
          <h2 className="text-xl font-bold text-white tracking-wider mb-8">MEDWEAR ADMIN</h2>
          <nav className="space-y-2">
            <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/admin' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}>
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link href="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname.includes('/admin/orders') ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}>
              <ShoppingBag size={20} />
              <span className="font-medium">Orders</span>
            </Link>
            <Link href="/admin/categories" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname.includes('/admin/categories') ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}>
              <FolderTree size={20} />
              <span className="font-medium">Categories</span>
            </Link>
            <Link href="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname.includes('/admin/products') ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}>
              <Package size={20} />
              <span className="font-medium">Products</span>
            </Link>
          </nav>
        </div>
        <div className="p-6">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left text-neutral-400 hover:bg-neutral-800 hover:text-red-400">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
