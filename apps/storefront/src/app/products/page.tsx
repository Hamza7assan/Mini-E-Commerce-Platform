import { getProducts, getCategories } from "@/lib/api";
import { ProductGrid } from "./ProductGrid";
import { ProductSearchSort } from "./ProductSearchSort";
import { Suspense } from "react";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string, q?: string, sort?: string }> }) {
  // Await searchParams for Next.js 15
  const resolvedParams = await searchParams;
  const category = resolvedParams.category;
  const q = resolvedParams.q;
  const sort = resolvedParams.sort;

  // Fetch products and categories in parallel
  const [productsData, categoriesData] = await Promise.all([
    getProducts(category, q, sort).catch(() => []),
    getCategories().catch(() => [])
  ]);

  const products = Array.isArray(productsData) ? productsData : productsData?.results || [];
  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.results || [];

  return (
    <div className="w-full bg-neutral-50 min-h-screen pb-24">
      {/* Page Header */}
      <div className="w-full bg-brand-600 py-16 flex items-center justify-center shadow-inner">
        <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-widest">
          Products
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <Suspense fallback={<div className="h-16 w-full animate-pulse bg-neutral-100 mb-6 rounded-xl"></div>}>
          <ProductSearchSort categories={categories} selectedCategory={category} totalResults={products.length} />
        </Suspense>

        <ProductGrid initialProducts={products} />
      </div>
    </div>
  );
}