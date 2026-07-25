import { getCategories } from "@/lib/api";
import { Category } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/Button";


export default async function CategoriesPage() {
  let categories = [];
  try {
    const data = await getCategories();
    categories = data?.results || data || [];
  } catch (error) {
    // handled via UI
  }

  return (
    <div className="w-full bg-neutral-50 min-h-screen pb-24">
      {/* Page Header */}
      <div className="w-full bg-brand-600 py-16 flex items-center justify-center shadow-inner">
        <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-widest">
          Categories
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {categories.length > 0 ? (
            categories.map((cat: Category) => (
              <div key={cat.id} className="flex flex-col group">
                <Link href={`/categories/${cat.slug}`} className="relative overflow-hidden rounded-xl bg-neutral-100 aspect-4/5 block shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100 mb-4">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-500 font-medium">No Image</div>
                  )}
                  
                  {/* Vertically rotated title on top-left edge */}
                  <div className="absolute top-6 left-6 z-10">
                    <h3 className="text-2xl md:text-3xl font-bold text-brand-600 tracking-wider [writing-mode:vertical-lr] rotate-180 drop-shadow-sm">{cat.name}</h3>
                  </div>

                  {/* Circle arrow button in top-right */}
                  <div className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-600 shadow-sm group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </div>
                </Link>
                <div className="text-center">
                  <Link href={`/categories/${cat.slug}`} className="text-sm font-medium text-brand-600 underline underline-offset-4 hover:text-brand-700 transition-colors">
                    Shop Now
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-neutral-500 py-20 text-lg">No Categories Found</p>
          )}
        </div>
      </div>
    </div>
  );
}
