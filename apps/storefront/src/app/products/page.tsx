import { getProducts, getCategories } from "@/lib/api";
import { ProductGrid } from "./ProductGrid";
import { FilterSidebar } from "./FilterSidebar";
import { ProductSearchSort } from "./ProductSearchSort";
import { Suspense } from "react";


export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string, q?: string, sort?: string }> }) {
  
  // Await searchParams for Next.js 15
  const resolvedParams = await searchParams;
  const category = resolvedParams.category;
  const q = resolvedParams.q;
  const sort = resolvedParams.sort;

  // We await both fetches in parallel if possible, or sequentially if relying on Next.js cache.
  const [productsData, categoriesData] = await Promise.all([
    getProducts(category, q, sort).catch(() => []),
    getCategories().catch(() => [])
  ]);

  // Adjust according to the DRF paginated response format (results array) or direct array.
  const products = Array.isArray(productsData) ? productsData : productsData?.results || [];
  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.results || [];

  return (
    <div className="w-full bg-neutral-50/30 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">All Products</h1>
          <p className="text-neutral-500">Explore Premium</p>
        </div>
        <div className="flex flex-col md:flex-row gap-10">
          <FilterSidebar categories={categories} selectedCategory={category} q={q} sort={sort} />
          <main className="grow">
            <Suspense fallback={<div className="h-16 w-full animate-pulse bg-neutral-100 mb-6 rounded-sm"></div>}>
              <ProductSearchSort />
            </Suspense>
            <div className="mb-4">
              <span className="text-sm text-neutral-500">Showing {products.length} results {q ? `for "${q}"` : ""}</span>
            </div>
            <ProductGrid initialProducts={products} />
          </main>
        </div>
      </div>
    </div>
  );
}