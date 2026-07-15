"use client"
import { motion } from "framer-motion"
import { staggerContainer, fadeUp } from "@/lib/motion-variants"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

import { Product } from "@/types";

export function ProductGrid({ initialProducts }: { initialProducts: Product[] }) {
  

  if (!initialProducts || initialProducts.length === 0) {
    return <div className="text-center py-12 text-neutral-500">No Products Found</div>
  }

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {initialProducts.map((product) => (
        <motion.div key={product.id} variants={fadeUp}>
          <Link href={`/products/${product.slug}`}>
            <Card className="group cursor-pointer h-full border border-neutral-100 shadow-sm hover:shadow-lg transition-all overflow-hidden bg-white flex flex-col">
              <div className="w-full aspect-3/4 bg-neutral-100 overflow-hidden relative">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
                )}
              </div>
              <CardContent className="p-5 flex flex-col grow">
                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                {product.category_name && (
                  <p className="text-xs font-semibold tracking-wider text-neutral-500 uppercase mt-1 mb-2">
                    {product.category_name}
                  </p>
                )}
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <p className="text-blue-600 font-bold text-lg">${parseFloat(product.price).toFixed(2)}</p>
                  <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    View Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
