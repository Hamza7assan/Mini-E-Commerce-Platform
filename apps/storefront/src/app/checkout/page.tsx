"use client";

import * as React from "react";
import { useCartStore } from "@/store/useCartStore";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion-variants";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, clearCart } = useCartStore((state) => state);
  
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const [deliveryMethod, setDeliveryMethod] = React.useState<"standard" | "express">("standard");
  const deliveryFee = deliveryMethod === "express" ? 3.0 : 0.0;
  const cartTotal = subtotal + deliveryFee;

  // Form field states for Figma layout
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [city, setCity] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setSubmitError("Please enter your first name");
      return;
    }
    if (!phone.trim()) {
      setSubmitError("Please enter your phone number");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setSubmitError("Please enter a valid email address");
      return;
    }
    if (!address.trim()) {
      setSubmitError("Please enter your shipping address");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        customer_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim(),
        shipping_address: `${address.trim()}, ${city.trim()} ${postalCode.trim()}, ${country.trim()}`.replace(/^, |, $/g, "").trim(),
        items: cartItems.map((item) => ({
          variant_id: item.id,
          quantity: item.quantity,
        })),
      };

      const { createOrder } = await import("@/lib/api");
      await createOrder(payload);

      clearCart();
      router.push("/checkout/success");
    } catch (error) {
      let errorMessage = error instanceof Error ? error.message : String(error);
      try {
        const parsed = JSON.parse(errorMessage);
        if (parsed.items && Array.isArray(parsed.items)) {
          errorMessage = parsed.items.join(" ");
        }
      } catch (err) {
        // Not JSON
      }
      setSubmitError(errorMessage || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-white py-20 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4 text-neutral-900">Your Cart is Empty</h1>
          <p className="text-sm text-neutral-500 mb-8">Add items to your cart before proceeding to checkout.</p>
          <Link href="/products">
            <button className="bg-[#024b5c] hover:bg-[#013a47] text-white px-8 py-3.5 rounded text-xs uppercase tracking-widest font-bold shadow transition-all">
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 md:py-16 text-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title - Figma Style: Checkout */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold text-[#024b5c] mb-12"
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Form Sections (Figma Style: No cards, clean headings) */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-10">
              {submitError && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-sm font-medium">{submitError}</div>
                </div>
              )}

              {/* Section 1: Personal Information */}
              <div>
                <h2 className="text-lg sm:text-xl font-medium text-[#527d8c] mb-5">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                      required
                      className="w-full border border-neutral-200 rounded-lg py-3 px-4 text-sm bg-white placeholder:text-neutral-400 focus:outline-none focus:border-[#024b5c] transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your Last name"
                      className="w-full border border-neutral-200 rounded-lg py-3 px-4 text-sm bg-white placeholder:text-neutral-400 focus:outline-none focus:border-[#024b5c] transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your Phone Number"
                      required
                      className="w-full border border-neutral-200 rounded-lg py-3 px-4 text-sm bg-white placeholder:text-neutral-400 focus:outline-none focus:border-[#024b5c] transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full border border-neutral-200 rounded-lg py-3 px-4 text-sm bg-white placeholder:text-neutral-400 focus:outline-none focus:border-[#024b5c] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Shipping Information */}
              <div>
                <h2 className="text-lg sm:text-xl font-medium text-[#527d8c] mb-5">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Country"
                      className="w-full border border-neutral-200 rounded-lg py-3 px-4 text-sm bg-white placeholder:text-neutral-400 focus:outline-none focus:border-[#024b5c] transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full border border-neutral-200 rounded-lg py-3 px-4 text-sm bg-white placeholder:text-neutral-400 focus:outline-none focus:border-[#024b5c] transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Address"
                      required
                      className="w-full border border-neutral-200 rounded-lg py-3 px-4 text-sm bg-white placeholder:text-neutral-400 focus:outline-none focus:border-[#024b5c] transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Postal Code"
                      className="w-full border border-neutral-200 rounded-lg py-3 px-4 text-sm bg-white placeholder:text-neutral-400 focus:outline-none focus:border-[#024b5c] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Delivery */}
              <div>
                <h2 className="text-lg sm:text-xl font-medium text-[#527d8c] mb-5">
                  Delivery
                </h2>
                <div className="space-y-3.5">
                  <label
                    onClick={() => setDeliveryMethod("standard")}
                    className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all ${
                      deliveryMethod === "standard"
                        ? "border-[#024b5c] bg-[#024b5c]/5"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          deliveryMethod === "standard" ? "border-[#024b5c]" : "border-neutral-300"
                        }`}
                      >
                        {deliveryMethod === "standard" && (
                          <div className="w-2 h-2 rounded-full bg-[#024b5c]" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-neutral-800">Standard Delivery</span>
                    </div>
                    <span className="text-sm font-medium text-neutral-600">Free</span>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod("express")}
                    className={`border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all ${
                      deliveryMethod === "express"
                        ? "border-[#024b5c] bg-[#024b5c]/5"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          deliveryMethod === "express" ? "border-[#024b5c]" : "border-neutral-300"
                        }`}
                      >
                        {deliveryMethod === "express" && (
                          <div className="w-2 h-2 rounded-full bg-[#024b5c]" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-neutral-800">Express Delivery</span>
                    </div>
                    <span className="text-sm font-medium text-[#024b5c]">3.00 JOD</span>
                  </label>
                </div>
              </div>

              {/* Confirm Order Button - Figma Style */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 bg-[#024b5c] hover:bg-[#013a47] disabled:opacity-70 text-white py-4 rounded-lg text-sm font-bold tracking-wider uppercase transition-all shadow-md hover:shadow-lg"
              >
                {isSubmitting ? "Processing Order..." : "Confirm Order"}
              </button>
            </form>
          </motion.div>

          {/* Right Column: Shopping Bag (Figma Style: No card border, clean list) */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="lg:col-span-5 sticky top-28">
            <h2 className="text-lg sm:text-xl font-medium text-[#024b5c] mb-6">
              Shopping Bag
            </h2>

            <div className="divide-y divide-neutral-100">
              {cartItems.map((item, i) => (
                <div key={i} className="py-4 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 grow">
                    <Link href={`/products/${item.id}`} className="w-14 h-16 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-100 block">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-[10px]">No Img</div>
                      )}
                    </Link>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug">{item.name}</h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5 capitalize">{item.color}</p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 shrink-0">
                    {(item.price * item.quantity).toFixed(2)} JOD
                  </span>
                </div>
              ))}
            </div>

            {/* Totals Summary */}
            <div className="border-t border-neutral-200 mt-6 pt-6 space-y-3">
              <div className="flex justify-between items-center text-xs sm:text-sm text-neutral-600">
                <span>Delivery(3-5 Business Days)</span>
                <span className="font-medium text-neutral-900">{deliveryMethod === "express" ? "3.00 JOD" : "Free"}</span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm text-neutral-600">
                <span>Subtotal</span>
                <span className="font-bold text-neutral-900">{subtotal.toFixed(2)} JOD</span>
              </div>
            </div>

            <div className="border-t border-neutral-200 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-neutral-900">Total</span>
                <span className="text-xl sm:text-2xl font-bold text-neutral-900">{cartTotal.toFixed(2)} JOD</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
