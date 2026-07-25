"use client";

import { Product } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProductGridProps {
  initialProducts: Product[];
}

export function ProductGrid({ initialProducts }: ProductGridProps) {
  if (!initialProducts || initialProducts.length === 0) {
    return (
      <div className="w-full py-20 text-center bg-white rounded-xl border border-neutral-200">
        <p className="text-lg text-neutral-500 font-medium">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
      {initialProducts.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="flex flex-col group"
        >
          <Link href={`/products/${product.slug}`} className="block overflow-hidden rounded-xl bg-neutral-100 aspect-3/4 mb-4 relative border border-neutral-100">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm font-medium">
                No Image
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          </Link>

          <div className="flex flex-col px-1">
            <Link href={`/products/${product.slug}`}>
              <h3 className="text-sm font-medium text-neutral-600 group-hover:text-brand-600 transition-colors truncate mb-1">
                {product.name}
              </h3>
            </Link>
            <p className="text-brand-600 font-bold text-base">
              {Number(product.price || 0).toFixed(0)} JOD
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
