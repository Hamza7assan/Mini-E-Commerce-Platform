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

  // Get the latest 4 products
  const latestProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col w-full bg-white">
      
      {/* 1. Hero Section */}
      <section 
        className="relative w-full h-[85vh] min-h-150 flex items-center bg-neutral-900 overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1584982751601-97d8cb0f6662?q=80&w=2070')",
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
        }}
      >
        <div className="absolute inset-0 bg-brand-600/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent ltr:from-black/80 ltr:to-transparent rtl:from-transparent rtl:to-black/80"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-start gap-6 text-white">
          <span className="text-brand-300 font-medium tracking-widest uppercase text-sm mb-2 opacity-90 animate-fade-in">New Collection</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold max-w-4xl leading-[1.1] tracking-tight drop-shadow-lg">
            Premium Medical Apparel for Modern Professionals
          </h1>
          
          <p className="text-lg md:text-xl max-w-2xl text-white/90 leading-relaxed font-light mt-2 drop-shadow-md">
            Experience unmatched comfort and style with our new collection of scrubs and lab coats designed for your demanding workday.
          </p>
          
          <div className="flex items-center gap-4 mt-8">
            <Link href="/products">
              <Button size="lg" className="bg-white !text-brand-600 hover:bg-neutral-100 hover:scale-105 hover:shadow-2xl transition-all duration-300 font-bold px-12 py-7 text-lg rounded-sm shadow-xl group flex items-center gap-3">
                Shop Now
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Banner */}
      <section className="w-full py-12 bg-brand-600 text-white border-y border-brand-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x sm:rtl:divide-x-reverse divide-white/20">
          <div className="flex flex-col items-center py-4 sm:py-0">
            <h4 className="text-xl font-bold mb-2 tracking-wide">Premium Fabrics</h4>
            <p className="text-brand-100 text-sm font-light">Antimicrobial, moisture-wicking, and stretchable.</p>
          </div>
          <div className="flex flex-col items-center py-4 sm:py-0">
            <h4 className="text-xl font-bold mb-2 tracking-wide">Tailored Fit</h4>
            <p className="text-brand-100 text-sm font-light">Designed to move with you.</p>
          </div>
          <div className="flex flex-col items-center py-4 sm:py-0">
            <h4 className="text-xl font-bold mb-2 tracking-wide">Fast Delivery</h4>
            <p className="text-brand-100 text-sm font-light">Free shipping on orders over 100 JOD.</p>
          </div>
        </div>
      </section>

      {/* 3. Categories */}
      <section className="w-full py-24 bg-neutral-50" id="categories">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
           <h2 className="text-4xl font-bold text-neutral-900 mb-16 relative">
             Featured Categories
             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-brand-600"></div>
           </h2>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full">
              {categories.slice(0, 5).map((cat: Category) => (
                <Link href={`/categories/${cat.slug}`} key={cat.id} className="group flex flex-col items-center gap-4 bg-white p-4 shadow-sm hover:shadow-xl transition-all duration-300 rounded-sm">
                  <div className="w-full aspect-square bg-neutral-100 overflow-hidden relative rounded-sm">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 bg-neutral-100">No Image</div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full rounded-sm tracking-widest uppercase font-semibold group-hover:bg-brand-600 group-hover:text-white transition-colors">{cat.name}</Button>
                </Link>
              ))}
           </div>
         </div>
      </section>

      {/* 4. New Release */}
      <section className="w-full py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex items-end justify-between mb-12 border-b border-neutral-200 pb-4">
             <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">Popular Products</h2>
             <Link href="/products" className="text-sm font-bold text-brand-600 hover:text-brand-800 uppercase tracking-wider hidden md:flex items-center gap-2 group">
               View All Products
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
             </Link>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {latestProducts.map((product: Product) => (
                <Link href={`/products/${product.slug}`} key={product.id} className="group flex flex-col cursor-pointer bg-white rounded-sm hover:shadow-2xl transition-all duration-300 p-4 border border-neutral-100 hover:border-transparent">
                  <div className="w-full aspect-3/4 bg-neutral-100 mb-6 overflow-hidden relative rounded-sm">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 bg-neutral-100">No Image</div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 group-hover:text-brand-600 transition-colors">{product.name}</h3>
                  <p className="text-sm text-neutral-500 mb-3 uppercase tracking-wide font-medium">{product.category_name || "Uncategorized"}</p>
                  <p className="text-brand-600 font-bold text-xl">{parseFloat(product.price).toFixed(2)} JOD</p>
                </Link>
              ))}
           </div>
         </div>
      </section>

      {/* 5. About Us */}
      <section className="w-full py-24 bg-neutral-900 text-white" id="about">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-16 justify-between items-center">
            <div className="md:w-1/2">
               <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose <span className="font-light text-brand-400">RM Medwear</span></h2>
               <div className="w-16 h-1 bg-brand-500 mb-8"></div>
               <p className="text-lg text-neutral-300 leading-relaxed">
                 At RM Medwear, we believe that medical professionals deserve apparel that works as hard as they do. Our premium scrubs combine innovative fabric technology with modern designs, ensuring you stay comfortable and confident throughout your shift.
               </p>
               <Link href="/products">
                 <Button variant="outline" className="mt-8 border-white text-white hover:bg-white hover:text-neutral-900 rounded-sm px-8 uppercase tracking-widest font-semibold">
                   Explore Collections
                 </Button>
               </Link>
            </div>
            <div className="md:w-1/2">
              <div className="aspect-video bg-neutral-800 rounded-sm overflow-hidden shadow-2xl relative">
                 <img src="/images/about-us.png" className="object-cover w-full h-full opacity-70 hover:opacity-100 transition-opacity duration-500" alt="About RM Medwear Team" />
              </div>
            </div>
         </div>
      </section>
      
    </div>
  );
}