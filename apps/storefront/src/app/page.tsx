import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/api";
import { Category, Product } from "@/types";

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
    // handled via UI
  }

  const latestProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col w-full bg-white">
      {/* 1. Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[75vh] flex items-center bg-brand-600 overflow-hidden">
        <div className="absolute inset-0 w-full h-full opacity-40 mix-blend-overlay">
          <img 
            src="https://images.unsplash.com/photo-1584982751601-97d8cb0f6662?q=80&w=2070" 
            alt="Hero Background" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white max-w-3xl leading-[1.15]">
            Effortless Comfort,<br />Professional Performance
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 font-light max-w-xl">
            Minimal effort, maximum comfort designed for the modern medical professional.
          </p>
          <div className="mt-10">
            <Link href="/products">
              <Button className="bg-white text-brand-600 hover:bg-neutral-100 rounded-sm font-semibold px-10 py-7 text-lg shadow-xl">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. About Us */}
      <section className="w-full py-24 bg-white" id="about">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
               <h2 className="text-4xl font-bold text-brand-600 mb-6">About Us</h2>
               <div className="w-12 h-1 bg-brand-600 mb-8"></div>
               <p className="text-lg text-neutral-600 leading-relaxed font-light">
                 At RM Medwear, we believe that medical professionals deserve apparel that works as hard as they do. Our premium scrubs combine innovative fabric technology with modern designs, ensuring you stay comfortable and confident throughout your shift. We merge quality with aesthetics to elevate your daily professional life.
               </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
               <div className="w-72 h-72 bg-brand-50 rounded-full flex items-center justify-center overflow-hidden border-8 border-white shadow-2xl relative">
                 <img src="/images/about-us.png" alt="About Us" className="w-full h-full object-cover" />
                 {/* Fallback image if local doesn't exist */}
                 <div className="absolute inset-0 -z-10">
                   <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070" className="w-full h-full object-cover" />
                 </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. Categories */}
      <section className="w-full py-24 bg-neutral-50" id="categories">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-bold text-brand-600 mb-12 text-center tracking-wider">Categories</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.slice(0, 4).map((cat: Category) => (
                <Link href={`/categories/${cat.slug}`} key={cat.id} className="group relative overflow-hidden rounded-sm shadow-sm hover:shadow-xl transition-all duration-300 h-96 bg-white block">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-400">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300"></div>
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[85%] bg-white py-4 text-center text-brand-600 font-bold uppercase tracking-widest shadow-lg rounded-sm group-hover:-translate-y-2 transition-transform duration-300">
                    {cat.name}
                  </div>
                </Link>
              ))}
           </div>
         </div>
      </section>

      {/* 4. New Release */}
      <section className="w-full py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-bold text-brand-600 mb-12 tracking-wider">New Release</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {latestProducts.map((product: Product) => (
                <Link href={`/products/${product.slug}`} key={product.id} className="group flex flex-col cursor-pointer bg-white">
                  <div className="w-full aspect-[3/4] bg-neutral-100 mb-4 overflow-hidden relative rounded-sm shadow-sm">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-400">No Image</div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-brand-600 transition-colors">{product.name}</h3>
                  <p className="text-brand-600 font-bold text-lg mt-2">{parseFloat(product.price).toFixed(2)} JOD</p>
                </Link>
              ))}
           </div>
           <div className="mt-16 flex justify-center">
             <Link href="/products">
                <Button className="bg-brand-600 text-white hover:bg-brand-700 rounded-sm font-semibold px-12 py-7 shadow-md tracking-widest uppercase">
                  View More
                </Button>
             </Link>
           </div>
         </div>
      </section>

      {/* 5. Contact Form Section */}
      <section className="w-full py-24 bg-neutral-50 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
         <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-600/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
         
         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white p-8 md:p-12 shadow-2xl rounded-sm border border-neutral-100">
              <h2 className="text-3xl font-bold text-brand-600 mb-8 text-center tracking-wide">Contact Us</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">First Name</label>
                    <input type="text" className="w-full border border-neutral-200 rounded-sm p-4 focus:ring-brand-600 focus:border-brand-600 outline-none transition-colors" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Last Name</label>
                    <input type="text" className="w-full border border-neutral-200 rounded-sm p-4 focus:ring-brand-600 focus:border-brand-600 outline-none transition-colors" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                  <input type="email" className="w-full border border-neutral-200 rounded-sm p-4 focus:ring-brand-600 focus:border-brand-600 outline-none transition-colors" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Message</label>
                  <textarea rows={4} className="w-full border border-neutral-200 rounded-sm p-4 focus:ring-brand-600 focus:border-brand-600 outline-none transition-colors resize-none" placeholder="How can we help?"></textarea>
                </div>
                <Button type="button" className="w-full bg-brand-600 text-white hover:bg-brand-700 rounded-sm py-7 mt-4 font-bold text-lg tracking-wider">
                  Submit Request
                </Button>
              </form>
            </div>
         </div>
      </section>
    </div>
  );
}