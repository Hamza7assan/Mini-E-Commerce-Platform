"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation"; 


export const CartDrawer = () => {
  const { isOpen, closeCart, items, updateQuantity, removeItem } = useCartStore();
  const router = useRouter(); 
  

  
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  
  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 right-0 ltr:right-0 rtl:right-auto rtl:left-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {}
            <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
              <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-wider">Title ({items.length})</h2>
              <button onClick={closeCart} className="text-neutral-400 hover:text-brand-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {}
            <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-neutral-500 h-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-20"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                  <p>Empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 border-b border-neutral-100 pb-6">
                    <div className="w-24 h-32 bg-neutral-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col flex-grow justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-neutral-900 text-sm leading-tight pr-4">{item.name}</h3>
                          <button onClick={() => removeItem(item.id, item.size, item.color)} className="text-neutral-400 hover:text-red-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">Size: {item.size} | Color: {item.color}</p>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border border-neutral-200 rounded-sm">
                          <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)} className="px-3 py-1 text-neutral-500 hover:text-brand-600 transition-colors">-</button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)} className="px-3 py-1 text-neutral-500 hover:text-brand-600 transition-colors">+</button>
                        </div>
                        <p className="font-semibold text-brand-600">{(item.price * item.quantity).toFixed(2)} JOD</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {}
            {items.length > 0 && (
              <div className="p-6 border-t border-neutral-100 bg-neutral-50/50">
                <div className="flex justify-between items-center mb-6 font-bold text-neutral-900 text-lg">
                  <span>Total</span>
                  <span>{subtotal.toFixed(2)} JOD</span>
                </div>
                {}
                <Button onClick={handleCheckout} className="w-full uppercase tracking-widest rounded-none" size="lg">
                  Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
