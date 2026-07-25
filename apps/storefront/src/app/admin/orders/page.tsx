"use client"
import { useEffect, useState } from "react"
import { getAdminOrders, updateOrderStatus } from "@/lib/api"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Eye, X } from "lucide-react"
import { Order, OrderItem } from "@/types"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("")
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const data = await getAdminOrders(statusFilter)
      setOrders(data?.results || data || [])
    } catch (err) {
      // handled via UI
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      fetchOrders() // refresh data
    } catch (err) {
      alert("Failed to update status")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-neutral-900">Orders</h1>
        <select 
          className="border rounded-md px-4 py-2 bg-white min-w-[200px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-neutral-600">ID</th>
                <th className="px-6 py-4 font-semibold text-neutral-600">Customer</th>
                <th className="px-6 py-4 font-semibold text-neutral-600">Items</th>
                <th className="px-6 py-4 font-semibold text-neutral-600">Total Price</th>
                <th className="px-6 py-4 font-semibold text-neutral-600">Status</th>
                <th className="px-6 py-4 font-semibold text-neutral-600">Date</th>
                <th className="px-6 py-4 font-semibold text-neutral-600 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-neutral-500">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-neutral-500">No orders found.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium">#{order.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-neutral-900">{order.customer_name}</p>
                      <p className="text-neutral-500 text-xs">{order.customer_email}</p>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{order.items?.length || 0} items</td>
                    <td className="px-6 py-4 font-medium text-neutral-900">${Number(order.total || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-sm border border-neutral-200 rounded-lg px-3 py-1.5 focus:ring-blue-600 focus:border-blue-600 bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-neutral-500">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-neutral-400 hover:text-blue-600 rounded bg-white border shadow-sm transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b shrink-0">
              <h2 className="text-xl font-bold">Order #{selectedOrder.id} Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-neutral-400 hover:text-neutral-900"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto grow space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2 border-b pb-2">Customer Info</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-neutral-500 w-20 inline-block">Name:</span> <span className="font-medium">{selectedOrder.customer_name}</span></p>
                    <p><span className="text-neutral-500 w-20 inline-block">Email:</span> <span>{selectedOrder.customer_email}</span></p>
                    <p><span className="text-neutral-500 w-20 inline-block">Phone:</span> <span>{selectedOrder.customer_phone || 'N/A'}</span></p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2 border-b pb-2">Shipping Address</h3>
                  <p className="text-sm text-neutral-700 whitespace-pre-line leading-relaxed">
                    {selectedOrder.shipping_address}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900 mb-3 border-b pb-2">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-50 border-b text-neutral-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Product / Variant</th>
                        <th className="px-4 py-3 font-medium text-center">Qty</th>
                        <th className="px-4 py-3 font-medium text-right">Price</th>
                        <th className="px-4 py-3 font-medium text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedOrder.items?.map((item: OrderItem) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <p className="font-medium">{item.product_name || `Product #${item.product || 'Unknown'}`}</p>
                            {(item.color || item.size) && (
                              <p className="text-xs text-neutral-500 mt-0.5">
                                {item.color} {item.size && `| ${item.size}`}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">${Number(item.unit_price || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-medium">${Number(item.line_total || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-neutral-50 border-t font-semibold">
                      <tr>
                        <td colSpan={3} className="px-4 py-3 text-right">Grand Total:</td>
                        <td className="px-4 py-3 text-right text-blue-600">${Number(selectedOrder.total || 0).toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t shrink-0 flex justify-end">
              <Button onClick={() => setSelectedOrder(null)} variant="outline">Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
