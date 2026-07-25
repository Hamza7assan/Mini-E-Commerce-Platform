"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Footer = () => {
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
    <footer className="bg-[#024b5c] text-white py-14 border-t border-white/10 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Centered Logo */}
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <Link href="/" className="flex flex-col items-center group">
            <img src="/images/rm-logo.png" alt="RM MedWear Logo" className="h-16 w-auto object-contain brightness-200 group-hover:opacity-90 transition-opacity" />
          </Link>
        </div>

        {/* 4 Columns Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left max-w-4xl mx-auto border-t border-white/10 pt-10">
          {/* Column 1: Menu */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4 text-white/90">
              Menu
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/#about" 
                  onClick={(e) => handleHashClick(e, "about")}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Social Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4 text-white/90">
              Social Links
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-3.5 h-3.5 inline-flex items-center justify-center">in</span> LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-3.5 h-3.5 inline-flex items-center justify-center">💬</span> WhatsApp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-3.5 h-3.5 inline-flex items-center justify-center">📷</span> Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-3.5 h-3.5 inline-flex items-center justify-center">f</span> Facebook
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4 text-white/90">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <a href="mailto:support@rmmedwear.com" className="hover:text-white transition-colors">
                  Email
                </a>
              </li>
              <li>
                <a href="tel:+962788677606" className="hover:text-white transition-colors">
                  Phone Number
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Language */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4 text-white/90">
              Language
            </h4>
            <div className="relative inline-block text-left">
              <button className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors py-1">
                <span>English</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
