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
    <div className="w-full bg-neutral-50 min-h-screen py-16">
      <div className="max-w-360 mx-auto px-4 md:px-8 lg:px-16 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-neutral-900 mb-16 relative">
          All Categories
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-brand-600"></div>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
          {categories.length > 0 ? (
            categories.map((cat: Category) => (
              <Link href={`/categories/${cat.slug}`} key={cat.id} className="group flex flex-col items-center gap-6">
                <div className="w-full aspect-3/4 bg-neutral-200 overflow-hidden relative">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 bg-neutral-200">No Image</div>
                  )}
                </div>
                <Button className="w-48 rounded-none tracking-widest uppercase">{cat.name}</Button>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-neutral-500">No Categories Found</p>
          )}
        </div>
      </div>
    </div>
  );
}
