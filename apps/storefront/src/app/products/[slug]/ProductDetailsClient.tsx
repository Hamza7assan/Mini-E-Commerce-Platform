"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { useCartStore } from "@/store/useCartStore"
import { motion } from "framer-motion"
import { fadeUp } from "@/lib/motion-variants"

import { Product, Variant } from "@/types";

export function ProductDetailsClient({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore()
  
  
  

  // Extract unique colors and sizes from variants
  const variants = product.variants || []
  const availableColors = Array.from(new Set(variants.map((v: Variant) => v.color)))
  const availableSizes = Array.from(new Set(variants.map((v: Variant) => v.size)))

  const [selectedColor, setSelectedColor] = useState<string>(availableColors[0] as string || "")
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] as string || "")

  // Find the currently selected variant based on color and size
  // If we only care about color for the image, we just need ANY variant with the selected color
  const selectedVariantForColor = variants.find((v: Variant) => v.color === selectedColor)
  const displayImage = selectedVariantForColor?.image || product.image

  const handleAddToCart = () => {
    // Find matching variant
    const variant = variants.find((v: Variant) => v.color === selectedColor && v.size === selectedSize)
    if (!variant) {
      alert("This variant is out of stock or does not exist.")
      return
    }

    addItem({
      id: variant.id, // Using variant.id so the checkout API can use it
      name: product.name,
      price: parseFloat(product.price),
      image: displayImage,
      size: selectedSize,
      color: selectedColor
    })
    openCart()
  }

  return (
    <div className="w-full bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <nav className="flex text-sm text-neutral-500 mb-8 gap-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="rtl:rotate-180">/</span>
          <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          <span className="rtl:rotate-180">/</span>
          <span className="text-neutral-900 font-medium">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4"
          >
            <div className="w-full aspect-3/4 md:aspect-4/5 bg-neutral-100 overflow-hidden relative rounded-xl border border-neutral-100">
              {displayImage ? (
                <img src={displayImage} alt={`${product.name} - ${selectedColor}`} className="w-full h-full object-cover transition-opacity duration-500" key={displayImage} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="w-full lg:w-1/2 flex flex-col"
          >
            <div className="mb-8 border-b border-neutral-100 pb-8">
              <span className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-2 block">{product.category_name}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{product.name}</h1>
              <p className="text-2xl text-neutral-900 font-medium mb-6">{parseFloat(product.price).toFixed(2)} JOD</p>
              <p className="text-neutral-600 leading-relaxed text-justify">{product.description}</p>
            </div>

            {availableColors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Color: <span className="font-normal text-neutral-500">{selectedColor}</span></h3>
                <div className="flex gap-3 flex-wrap">
                  {availableColors.map((color: string) => (
                    <button 
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-full transition-all border text-sm font-medium ${selectedColor === color ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-neutral-200 text-neutral-700 hover:border-blue-600'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {availableSizes.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-neutral-900 mb-4">Size</h3>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {availableSizes.map((size: string) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 border transition-colors rounded-lg text-sm font-medium ${selectedSize === size ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-neutral-200 text-neutral-900 hover:border-blue-600'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-auto">
              <Button onClick={handleAddToCart} size="lg" className="grow text-lg uppercase tracking-wider rounded-xl py-6 bg-blue-600 hover:bg-blue-700">
                Add To Cart
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
