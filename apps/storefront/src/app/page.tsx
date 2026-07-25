import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api";
import { Category, Product } from "@/types";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { HashScroller } from "@/components/home/HashScroller";

export default async function Home() {
  let categories: Category[] = [];
  let products: Product[] = [];

  try {
    const [catData, prodData] = await Promise.all([
      getCategories(),
      getProducts()
    ]);
    categories = catData?.results || catData || [];
    products = prodData?.results || prodData || [];
  } catch (error) {
    // handled via UI fallback
  }

  // Display top 3 products for New Release section as in Figma screenshot
  const latestProducts = products.slice(0, 3);

  const testimonials = [
    {
      quote: "The comfort and fit exceeded my expectations. These scrubs truly support me through every shift.",
      author: "Dr. Lina Haddad",
      avatar: "LH"
    },
    {
      quote: "Finally, medical apparel that looks professional without sacrificing breathability. I bought three sets!",
      author: "Omar Khalil",
      avatar: "OK"
    },
    {
      quote: "The fabric quality is outstanding. Still looks brand new even after repeated high-temperature washes.",
      author: "Sara Al-Nasser",
      avatar: "SN"
    }
  ];

  return (
    <div className="flex flex-col w-full bg-white text-neutral-800">
      <HashScroller />
      {/* 1. HERO SECTION (Screenshot 2 Top) */}
      <section className="relative w-full min-h-[92vh] flex flex-col justify-between bg-[#0b2830] overflow-hidden pt-24 pb-0">
        {/* Hero Background Image - Full 100% brightness without cyan or dark overlays */}
        <div className="absolute inset-0 w-full h-full opacity-100 z-0">
          <img 
            src="/images/hero.png" 
            alt="Medical Scrub Professional" 
            className="w-full h-full object-cover object-center" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent z-0"></div>

        {/* Main Hero Text & Button Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-10 my-auto py-16">
          {/* Left Title */}
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold text-white leading-[1.08] tracking-tight drop-shadow-md">
              Effortless Comfort,<br />
              Professional Performance
            </h1>
          </div>

          {/* Right Subtitle & Pill Button */}
          <div className="max-w-sm text-left md:text-right flex flex-col items-start md:items-end shrink-0">
            <p className="text-sm sm:text-base text-white/90 font-normal leading-relaxed mb-6 drop-shadow">
              Minimal effort, maximum comfort — professional scrubs designed just for you
            </p>
            <Link href="/products">
              <button className="border border-white/60 bg-white/10 backdrop-blur-md hover:bg-white hover:text-[#024b5c] text-white px-7 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-3 shadow-lg group">
                <span>Explore Products</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Bottom 3-Column Feature Strip (100% Transparent Background with True Transparent PNG icons - Image 1) */}
        <div className="relative z-10 w-full bg-transparent border-t border-white/30 mt-auto backdrop-blur-[2px]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3">
            <div className="flex items-center gap-4 p-6 text-white font-medium text-xs sm:text-sm">
              <img src="/images/rm-icon.png" alt="RM Icon" className="w-8 h-8 object-contain shrink-0 drop-shadow" />
              <span className="leading-snug">Engineered for comfort and all-day performance</span>
            </div>

            <div className="flex items-center gap-4 p-6 text-white font-medium text-xs sm:text-sm border-t md:border-t-0 md:border-l border-white/30">
              <img src="/images/rm-icon.png" alt="RM Icon" className="w-8 h-8 object-contain shrink-0 drop-shadow" />
              <span className="leading-snug">Breathable fabrics with lasting durability</span>
            </div>

            <div className="flex items-center gap-4 p-6 text-white font-medium text-xs sm:text-sm border-t md:border-t-0 md:border-l border-white/30">
              <img src="/images/rm-icon.png" alt="RM Icon" className="w-8 h-8 object-contain shrink-0 drop-shadow" />
              <span className="leading-snug">Designed for movement, built for long shifts</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT US SECTION (Screenshot 2 Middle) */}
      <section className="w-full py-24 bg-white overflow-hidden border-b border-neutral-100" id="about">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-12 lg:gap-20 items-start md:items-center">
          {/* Left Column: Huge Title */}
          <div className="md:w-5/12 shrink-0">
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
              <span className="text-[#7CA1B4] font-normal">About </span>
              <span className="text-[#024b5c]">Us</span>
            </h2>
          </div>

          {/* Right Column: Two Rows with thin line */}
          <div className="md:w-7/12 grow flex flex-col">
            {/* Row 1: Our Story */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7CA1B4] w-28 shrink-0 pt-1">
                Our Story
              </span>
              <p className="text-xs sm:text-sm text-[#024b5c] leading-relaxed font-normal">
                RM — More than a name<br />
                RM MedWear was born from a father-and-daughter vision.<br />
                Founded by Rahaf Murad (RM), a pharmacy student, alongside her father Murad, a fashion designer, blending medicine with refined design.<br />
                More than scrubs — a story you carry.
              </p>
            </div>

            <hr className="my-8 border-[#024b5c]/20" />

            {/* Row 2: Mission & Vision */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7CA1B4] w-28 shrink-0 pt-1">
                Mission &amp;<br />Vision
              </span>
              <p className="text-xs sm:text-sm text-[#024b5c] leading-relaxed font-normal">
                Our mission is to elevate medical workwear through quality, innovation, and thoughtful design. Our vision is to redefine comfort, confidence, and performance for professionals everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION (Screenshot 2 Bottom & Screenshot 3 Top) */}
      <section className="w-full py-20 bg-white" id="categories">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#024b5c] tracking-tight text-center mb-12">
            Categories
          </h2>

          {/* Grid of 3 Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {categories.slice(0, 3).map((cat: Category) => (
              <div key={cat.id} className="flex flex-col">
                <Link
                  href={`/categories/${cat.slug}`}
                  className="group relative overflow-hidden rounded-xl bg-neutral-100 aspect-[4/5] block shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100"
                >
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400 font-medium">
                      No Image
                    </div>
                  )}

                  {/* Vertically Rotated Title on Top-Left Edge */}
                  <div className="absolute top-5 left-5 z-10">
                    <h3 className="text-2xl font-bold text-[#024b5c] tracking-wider [writing-mode:vertical-lr] rotate-180 drop-shadow-sm">
                      {cat.name}
                    </h3>
                  </div>

                  {/* White Circle Arrow Button in Top-Right */}
                  <div className="absolute top-5 right-5 z-10 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-[#024b5c] shadow-sm group-hover:bg-[#024b5c] group-hover:text-white transition-all duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </div>
                </Link>

                {/* Centered Shop Now Link Below Card */}
                <div className="text-center mt-3">
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-xs font-medium text-[#024b5c] underline underline-offset-4 hover:text-[#013a47] transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Centered VIEW MORE Button Below Grid */}
          <div className="text-center mt-12">
            <Link href="/categories">
              <button className="bg-[#024b5c] hover:bg-[#013a47] text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded shadow-md transition-all">
                VIEW MORE
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. NEW RELEASE SECTION (Screenshot 3 Middle) */}
      <section className="w-full py-20 bg-white border-t border-neutral-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Header & View More Link */}
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              <span className="text-[#7CA1B4] font-normal">New </span>
              <span className="text-[#024b5c]">Release</span>
            </h2>
            <Link href="/products" className="text-xs font-semibold text-[#024b5c] underline underline-offset-4 hover:opacity-80">
              View More
            </Link>
          </div>

          {/* 3 Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {latestProducts.map((product: Product, index: number) => (
              <Link
                href={`/products/${product.slug}`}
                key={product.id}
                className="group flex flex-col cursor-pointer bg-white"
              >
                <div className="w-full aspect-[3/4] bg-neutral-100 mb-3 overflow-hidden relative rounded-lg border border-neutral-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-400 font-medium text-sm">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start px-1">
                  <p className="text-[11px] text-neutral-400 font-medium">Product NO.{index + 1}</p>
                  <h3 className="text-xs sm:text-sm font-bold text-[#024b5c] group-hover:text-[#013a47] transition-colors truncate w-full mt-0.5">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#024b5c] mt-1">
                    {Number(product.price || 0).toFixed(0)} JOD
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Progress Line */}
          <div className="w-48 h-1 bg-neutral-200 mx-auto mt-14 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-[#024b5c] rounded-full"></div>
          </div>
        </div>
      </section>

      {/* 5. WHAT OUR CUSTOMERS SAY SECTION (Screenshot 3 Bottom) */}
      <section className="w-full py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-14">
            <span className="text-[#7CA1B4] font-normal">What Our </span>
            <span className="text-[#024b5c]">Customers </span>
            <span className="text-[#7CA1B4] font-normal">Say</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <div
                key={index}
                className="bg-white border border-neutral-100 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="text-[#7CA1B4] text-3xl font-serif font-bold mb-2 leading-none">&ldquo;</div>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal mb-6">
                    {t.quote}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4 text-sm">
                    {"★★★★★"}
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-8 h-8 rounded-full bg-[#024b5c] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {t.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#024b5c]">{t.author}</h4>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-[#024b5c] hover:bg-[#013a47] text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded shadow-md transition-all">
              ADD A REVIEW
            </button>
          </div>
        </div>
      </section>

      {/* 6. MID-PAGE BANNER SECTION (Screenshot 4 Top / Screenshot 5 / Image 2) */}
      <section className="w-full bg-[#827f79] text-white relative overflow-hidden my-8 min-h-[380px] md:min-h-[460px] flex items-center">
        {/* Background photo - 100% natural brightness and aligned to show full heads/bodies on the right */}
        <div className="absolute inset-0 w-full h-full opacity-100 z-0">
          <img
            src="/images/taupe-banner.png"
            alt="Medical Scrub Models Back to Back"
            className="w-full h-full object-cover object-[80%_20%] md:object-right-top"
          />
        </div>
        {/* Subtle left gradient only to guarantee text legibility on small screens without darkening the models */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent z-0 md:hidden"></div>

        <div className="max-w-6xl mx-auto w-full px-6 sm:px-8 lg:px-12 flex flex-col justify-center relative z-10 text-left py-12">
          <div className="max-w-md">
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-normal leading-[1.15] tracking-tight drop-shadow-sm">
              Get The Perfect Scrubs<br />
              <span className="font-bold">For Every Shift!</span>
            </h2>
            <Link href="/products" className="inline-block mt-8">
              <button className="border border-white/70 bg-white/5 backdrop-blur-[2px] hover:bg-white hover:text-[#5a5752] text-white px-8 py-2.5 rounded text-xs uppercase tracking-widest font-medium transition-all shadow-sm">
                Discover Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS SECTION (Screenshot 4 Middle) */}
      <section className="w-full py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-14">
            <span className="text-[#7CA1B4] font-normal">Frequently Ask </span>
            <span className="text-[#024b5c]">Questions</span>
          </h2>

          <FaqAccordion />
        </div>
      </section>

      {/* 8. CONTACT US & QUOTATION FORM SECTION (Screenshot 4 Bottom) */}
      <section className="w-full py-20 bg-white border-t border-neutral-100" id="contact">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column - Info */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  <span className="text-[#7CA1B4] font-normal">Contact </span>
                  <span className="text-[#024b5c]">Us</span>
                </h2>
                <p className="mt-4 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Need help choosing your scrubs? Our team is ready to assist—fill out the form and we&apos;ll respond within 24 hours.
                </p>
              </div>

              <div className="space-y-5 pt-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#EFF5F7] text-[#024b5c] flex items-center justify-center shrink-0 text-base">
                    📞
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Call Us</h4>
                    <p className="text-xs text-neutral-600 font-medium mt-0.5">+962 78 86 77 606</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#EFF5F7] text-[#024b5c] flex items-center justify-center shrink-0 text-base">
                    ✉️
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Email Support</h4>
                    <p className="text-xs text-neutral-600 font-medium mt-0.5">support@rmmedwear.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Quotation Form */}
            <div className="lg:col-span-7">
              <h3 className="text-xs sm:text-sm font-bold text-[#7CA1B4] mb-3">
                Get a Quotation Form
              </h3>
              <div className="bg-[#EFF5F7]/70 p-6 sm:p-8 rounded-2xl border border-[#D5E5EC]/60 shadow-sm">
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      className="w-full bg-white border border-[#D5E5EC] rounded-lg p-3 text-xs text-neutral-800 outline-none focus:border-[#024b5c] transition-colors placeholder:text-neutral-400"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="w-full bg-white border border-[#D5E5EC] rounded-lg p-3 text-xs text-neutral-800 outline-none focus:border-[#024b5c] transition-colors placeholder:text-neutral-400"
                      placeholder="Enter you phone number..."
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      className="w-full bg-white border border-[#D5E5EC] rounded-lg p-3 text-xs text-neutral-800 outline-none focus:border-[#024b5c] transition-colors placeholder:text-neutral-400"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="w-full bg-white border border-[#D5E5EC] rounded-lg p-3 text-xs text-neutral-800 outline-none focus:border-[#024b5c] transition-colors placeholder:text-neutral-400"
                      placeholder="Organization / Clinic Name (Optional)"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={4}
                      className="w-full bg-white border border-[#D5E5EC] rounded-lg p-3 text-xs text-neutral-800 outline-none focus:border-[#024b5c] transition-colors resize-none placeholder:text-neutral-400"
                      placeholder="Request a Quote(Please mention quantity, sizes, and any customization if applicable)"
                    ></textarea>
                  </div>
                  <button
                    type="button"
                    className="w-full sm:w-auto bg-[#024b5c] hover:bg-[#013a47] text-white font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded shadow-md transition-all"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}