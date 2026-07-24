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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.length > 0 ? (
            categories.map((cat: Category) => (
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
            ))
          ) : (
            <p className="col-span-full text-center text-neutral-500 py-20 text-lg">No Categories Found</p>
          )}
        </div>
      </div>
    </div>
  );
}
