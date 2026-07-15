import { redirect } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Redirect to the Products page with the category filter applied
  redirect(`/products?category=${slug}`);
}
