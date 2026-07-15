"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { fadeUp } from "@/lib/motion-variants"

export default function CheckoutSuccessPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-lg min-h-[60vh] flex flex-col justify-center">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check size={32} />
      </motion.div>
      <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">
        Order Confirmed!
      </motion.h1>
      <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2} className="text-neutral-500 mb-8 text-lg">
        Your order has been placed successfully. We'll send you an email with your shipping details shortly.
      </motion.p>
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
        <Button onClick={() => router.push('/')} className="bg-neutral-900 hover:bg-neutral-800 text-lg px-8 py-6 h-auto">
          Continue Shopping
        </Button>
      </motion.div>
    </div>
  )
}
