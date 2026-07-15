"use client"
import { useEffect, useState } from "react"
import { getDashboardStats } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { ShoppingBag, Package, DollarSign } from "lucide-react"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    total_orders: 0,
    total_products: 0,
    total_revenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then(data => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <Card className="border-neutral-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
               <div className="h-8 bg-neutral-100 rounded animate-pulse"></div>
            ) : (
              <div className="text-2xl font-bold text-neutral-900">
                ${parseFloat(stats.total_revenue as any || 0).toFixed(2)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-neutral-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Total Orders</CardTitle>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {loading ? (
               <div className="h-8 bg-neutral-100 rounded animate-pulse"></div>
            ) : (
              <div className="text-2xl font-bold text-neutral-900">{stats.total_orders}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-neutral-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">Total Products</CardTitle>
            <Package className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
             {loading ? (
               <div className="h-8 bg-neutral-100 rounded animate-pulse"></div>
            ) : (
              <div className="text-2xl font-bold text-neutral-900">{stats.total_products}</div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
