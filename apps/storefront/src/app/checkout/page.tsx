"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { checkoutSchema, type CheckoutInput } from "@shared/schemas/checkout.schema"
import { useCartStore } from "@/store/useCartStore"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { motion } from "framer-motion"
import { fadeUp } from "@/lib/motion-variants"
import { Check, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"


export default function CheckoutPage() {
  const router = useRouter()
  
  
  const { items: cartItems, clearCart } = useCartStore((state) => state)
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      }))
    }
  })

  const [submitError, setSubmitError] = React.useState<string | null>(null)

  // Sync items to form if cart changes
  React.useEffect(() => {
    setValue("items", cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      })))
  }, [cartItems, setValue])

  const onSubmit = async (data: CheckoutInput) => {
    try {
      // Map frontend items (productId) to backend items (variant_id)
      const payload = {
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        shipping_address: data.shippingAddress,
        items: data.items.map(item => ({
          variant_id: item.productId,
          quantity: item.quantity
        }))
      }
      
      const { createOrder } = await import("@/lib/api")
      await createOrder(payload)
      
      setSubmitError(null)
      clearCart()
      router.push('/checkout/success')
    } catch (error) {
      let errorMessage = error.message
      try {
        const parsed = JSON.parse(error.message)
        if (parsed.items && Array.isArray(parsed.items)) {
          errorMessage = parsed.items.join(" ")
        }
      } catch (e) {
        // Not JSON
      }
      setSubmitError(errorMessage)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Empty</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.h1 
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="text-3xl font-bold mb-8 text-neutral-900"
      >
        Title
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {submitError && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  {submitError}
                </div>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Shipping Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name</label>
                  <Input {...register("customerName")} placeholder="John Doe" />
                  {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input {...register("customerEmail")} type="email" placeholder="john@example.com" />
                  {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone</label>
                  <Input {...register("customerPhone")} placeholder="+1234567890" />
                  {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Address</label>
                  <Input {...register("shippingAddress")} placeholder="123 Main St, City, Country" />
                  {errors.shippingAddress && <p className="text-red-500 text-xs mt-1">{errors.shippingAddress.message}</p>}
                </div>
                {errors.items && <p className="text-red-500 text-xs mt-1">{errors.items.message}</p>}

                <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
                  {isSubmitting ? "Processing" : "Place Order"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
          <Card className="bg-neutral-50/50">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {cartItems.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <p className="text-neutral-500 text-xs">Qty: {item.quantity} | {item.size} | {item.color}</p>
                    </div>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-neutral-200 mt-6 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
