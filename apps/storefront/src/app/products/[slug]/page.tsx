import { getProductBySlug } from "@/lib/api";
import { ProductDetailsClient } from "./ProductDetailsClient";
import { notFound } from "next/navigation";

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug).catch(() => null);

  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}