import Link from "next/link"

import { Category } from "@/types";

export function FilterSidebar({ categories, selectedCategory, q, sort }: { categories: Category[], selectedCategory?: string, q?: string, sort?: string }) {
  
  
  const buildHref = (cat?: string) => {
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    if (q) params.set('q', q);
    if (sort) params.set('sort', sort);
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ''}`;
  }

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="sticky top-28 bg-white border border-neutral-100 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-neutral-900 mb-6 uppercase tracking-wider">Filters</h3>
        <div className="mb-8">
          <h4 className="font-semibold text-neutral-900 mb-3">Categories</h4>
          <div className="space-y-2 flex flex-col">
            <Link 
              href={buildHref()} 
              className={`text-sm ${!selectedCategory ? 'text-blue-600 font-medium' : 'text-neutral-600 hover:text-blue-600'}`}
            >
              All Products
            </Link>
            {categories.map((cat: Category) => (
              <Link 
                key={cat.slug}
                href={buildHref(cat.slug)} 
                className={`text-sm ${selectedCategory === cat.slug ? 'text-blue-600 font-medium' : 'text-neutral-600 hover:text-blue-600'}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
