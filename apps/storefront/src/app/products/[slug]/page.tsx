import { getProductBySlug, getProducts } from "@/lib/api";
import { ProductDetailsClient } from "./ProductDetailsClient";
import { notFound } from "next/navigation";
import { Product } from "@/types";

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug).catch(() => null);

  if (!product) {
    notFound();
  }

  // Fetch related products
  const allProductsData = await getProducts(product.category_slug).catch(() => []);
  const allProducts: Product[] = Array.isArray(allProductsData) ? allProductsData : allProductsData?.results || [];
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return <ProductDetailsClient product={product} relatedProducts={relatedProducts} />;
}