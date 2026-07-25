"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { usePathname } from "next/navigation";

export const Header = () => {
  const openCart = useCartStore((state) => state.openCart);
  const items = useCartStore((state) => state.items);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`${
        isHome
          ? "absolute top-0 left-0 w-full z-50 bg-transparent py-6"
          : "sticky top-0 left-0 w-full z-50 bg-[#024b5c] py-4 shadow-md"
      } text-white transition-all`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo (True Transparent PNG) */}
        <Link href="/" className="group flex items-center justify-center">
          <img src="/images/rm-logo.png" alt="RM MedWear" className="h-12 w-auto object-contain drop-shadow" />
        </Link>

        {/* Center Pill Nav (as in Figma screenshot) */}
        <nav className="hidden md:flex items-center gap-8 bg-white/10 backdrop-blur-md px-8 py-2.5 rounded-full border border-white/20 text-xs sm:text-sm font-medium tracking-wide shadow-lg">
          <Link href="/" className="hover:text-white/80 transition-colors">
            Home
          </Link>
          <Link 
            href="/#about" 
            onClick={(e) => handleHashClick(e, "about")}
            className="hover:text-white/80 transition-colors"
          >
            About Us
          </Link>
          <Link href="/categories" className="hover:text-white/80 transition-colors">
            Categories
          </Link>
          <Link href="/products" className="hover:text-white/80 transition-colors">
            Products
          </Link>
          <Link 
            href="/#contact" 
            onClick={(e) => handleHashClick(e, "contact")}
            className="hover:text-white/80 transition-colors"
          >
            Contact Us
          </Link>
        </nav>

        {/* Right Actions: Language & Cart */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Language Selector */}
          <div className="hidden sm:flex items-center gap-1 text-xs sm:text-sm cursor-pointer hover:opacity-80 transition-opacity">
            <span className="font-serif">文A</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Cart Icon */}
          <button
            onClick={openCart}
            className="relative p-2 text-white hover:opacity-80 transition-opacity group"
            title="View Bag"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[#024b5c] text-[11px] font-bold flex items-center justify-center rounded-full shadow-md group-hover:scale-110 transition-transform">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
