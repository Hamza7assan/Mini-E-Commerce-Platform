"use client"; 

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";



export const Header = () => {
  const openCart = useCartStore((state) => state.openCart);
  

  return (
    <header className="sticky top-0 z-40 w-full bg-brand-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col text-white">
          <span className="text-3xl font-serif font-bold tracking-widest leading-none">RM</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <Link href="/#about" className="hover:text-white transition-colors">About Us</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6">
          
          {/* Cart Toggle */}
          <button 
            onClick={openCart} 
            className="relative p-2 text-white/90 hover:text-white transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            <span className="absolute top-0 right-0 w-4 h-4 bg-white text-brand-600 text-[10px] font-bold flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
