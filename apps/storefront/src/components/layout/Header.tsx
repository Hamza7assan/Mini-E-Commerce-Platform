"use client"; 

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";



export const Header = () => {
  const openCart = useCartStore((state) => state.openCart);
  

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-360 mx-auto px-4 md:px-8 lg:px-16 h-20 flex items-center justify-between">
        {}
        <Link href="/" className="flex flex-col text-brand-600">
          <span className="text-2xl font-bold tracking-wider leading-none">RM</span>
          <span className="text-[10px] tracking-[0.2em] font-medium mt-1 uppercase">Medwear</span>
        </Link>

        {}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <Link href="/#about" className="hover:text-brand-600 transition-colors">About Us</Link>
          <Link href="/categories" className="hover:text-brand-600 transition-colors">Categories</Link>
          <Link href="/products" className="hover:text-brand-600 transition-colors">Products</Link>
        </nav>

        {}
        <div className="flex items-center gap-6">
          
          
          <button 
            onClick={openCart} 
            className="relative p-2 text-neutral-600 hover:text-brand-600 transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            <span className="absolute top-0 right-0 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
