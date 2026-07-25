"use client";

import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion-variants";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const router = useRouter();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 0; // Free delivery
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] bg-white py-20 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#024b5c]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">Your Cart is Empty</h1>
          <p className="text-sm text-neutral-500 mb-8">
            Looks like you haven't added any scrubs or medical apparel to your cart yet.
          </p>
          <Link href="/products">
            <button className="bg-[#024b5c] hover:bg-[#013a47] text-white uppercase tracking-widest text-xs font-bold px-8 py-4 rounded shadow transition-all">
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-14 md:py-20 text-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title - Figma Style: YOUR CART */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-14">
          <span className="text-[#7CA1B4] font-normal">YOUR </span>
          <span className="text-[#024b5c]">CART</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 items-start">
          {/* Left Column: Cart Items List (Clean borderless Figma design) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="w-full lg:w-7/12"
          >
            <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="py-8 flex items-center justify-between gap-6">
                  {/* Image & Details */}
                  <div className="flex items-center gap-6 grow">
                    <Link href={`/products/${item.id}`} className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg bg-neutral-100 overflow-hidden shrink-0 block border border-neutral-100">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">No Image</div>
                      )}
                    </Link>
                    <div className="flex flex-col justify-center">
                      <Link href={`/products/${item.id}`}>
                        <h3 className="text-sm sm:text-base font-bold text-neutral-900 hover:text-[#024b5c] transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-neutral-500 mt-1 capitalize font-normal">
                        {item.color}
                      </p>
                      <p className="text-sm font-bold text-[#024b5c] mt-2 sm:hidden">
                        {(item.price * item.quantity).toFixed(2)} JOD
                      </p>
                    </div>
                  </div>

                  {/* Quantity Pill & Price */}
                  <div className="flex items-center gap-6 sm:gap-10 shrink-0">
                    {/* Quantity Control Pill (- 1 +) */}
                    <div className="inline-flex items-center border border-neutral-200 rounded-full bg-white px-3 py-1 gap-3 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.quantity <= 1) {
                            removeItem(item.id, item.size, item.color);
                          } else {
                            updateQuantity(item.id, item.size, item.color, item.quantity - 1);
                          }
                        }}
                        className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-neutral-900 font-normal text-sm transition-colors"
                      >
                        −
                      </button>
                      <span className="w-4 text-center font-semibold text-xs text-neutral-900">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-neutral-900 font-normal text-sm transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Item Price */}
                    <span className="text-sm sm:text-base font-bold text-neutral-900 hidden sm:block min-w-[5rem] text-right">
                      {(item.price * item.quantity).toFixed(2)} JOD
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtle Clear Cart option */}
            {items.length > 0 && (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] font-medium text-neutral-400 hover:text-red-600 uppercase tracking-wider transition-colors"
                >
                  Clear Bag
                </button>
              </div>
            )}
          </motion.div>

          {/* Right Column: Cart Totals (Figma style) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="w-full lg:w-5/12 bg-white sticky top-28"
          >
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#024b5c] pb-4 border-b border-neutral-200 mb-6">
              CART TOTALS
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-xs sm:text-sm text-neutral-600">
                <span>Delivery(3-5 Business Days)</span>
                <span className="font-medium text-neutral-900">Free</span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm text-neutral-600">
                <span>Subtotal</span>
                <span className="font-bold text-neutral-900">{subtotal.toFixed(2)} JOD</span>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold uppercase tracking-wider text-neutral-900">Total</span>
                <span className="text-xl sm:text-2xl font-bold text-neutral-900">{total.toFixed(2)} JOD</span>
              </div>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full py-4 text-xs font-bold uppercase tracking-widest rounded bg-[#024b5c] hover:bg-[#013a47] text-white shadow hover:shadow-md transition-all"
            >
              PROCEED TO CHECKOUT
            </button>

            {/* Continue Shopping link centered below button as in Figma */}
            <div className="text-center mt-5">
              <Link href="/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors uppercase tracking-wider">
                <span>&lt;</span> CONTINUE SHOPPING
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
