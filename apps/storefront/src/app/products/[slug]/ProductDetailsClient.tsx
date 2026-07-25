"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion-variants";
import { Product, Variant } from "@/types";

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts?: Product[];
}

const COLOR_HEX_MAP: Record<string, string> = {
  Navy: "#0A192F",
  Ceil: "#7CA1B4",
  Black: "#111111",
  Burgundy: "#4A0E17",
  "Hunter Green": "#1A3626",
  Standard: "#E2E8F0",
  White: "#F8FAFC",
  Grey: "#475569",
  Pink: "#E8B4B8",
  Rose: "#E8B4B8",
  Blue: "#1E3A8A",
  Teal: "#024b5c",
};

export function ProductDetailsClient({ product, relatedProducts = [] }: ProductDetailsClientProps) {
  const { addItem, openCart } = useCartStore();

  const variants = product.variants || [];
  const availableColors = Array.from(new Set(variants.map((v: Variant) => v.color).filter(Boolean))) as string[];
  const availableSizes = Array.from(new Set(variants.map((v: Variant) => v.size).filter(Boolean))) as string[];

  const [selectedColor, setSelectedColor] = useState<string>(availableColors[0] || "");
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0] || "");
  const [quantity, setQuantity] = useState<number>(1);

  // Collect unique images for thumbnail gallery
  const allImages = Array.from(
    new Set([product.image, ...variants.map((v: Variant) => v.image)].filter(Boolean))
  ) as string[];

  // Ensure we have at least 3 thumbnails by repeating if needed for the Figma visual structure
  const thumbnailGallery: string[] = (allImages.length >= 3
    ? allImages.slice(0, 4)
    : [product.image, ...allImages, product.image, product.image].filter(Boolean).slice(0, 3)) as string[];

  const selectedVariantForColor = variants.find((v: Variant) => v.color === selectedColor);
  const [activeImage, setActiveImage] = useState<string>(selectedVariantForColor?.image || product.image || "");

  const displayImage: string = activeImage || selectedVariantForColor?.image || product.image || "";

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const varForCol = variants.find((v: Variant) => v.color === color);
    if (varForCol?.image) {
      setActiveImage(varForCol.image);
    }
  };

  const handleAddToCart = () => {
    const variant = variants.find((v: Variant) => v.color === selectedColor && v.size === selectedSize) || variants[0];
    const targetId = variant ? variant.id : product.id;

    addItem({
      id: targetId,
      name: product.name,
      price: Number(product.price || 0),
      image: displayImage || "",
      size: selectedSize || "Standard",
      color: selectedColor || "Standard",
      quantity: Math.max(1, quantity),
    });
    openCart();
  };

  return (
    <div className="w-full bg-white py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        {/* Breadcrumb */}
        <nav className="flex text-xs md:text-sm text-neutral-500 mb-8 gap-2 items-center">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <span className="text-neutral-300">/</span>
          <Link href="/products" className="hover:text-brand-600 transition-colors">Products</Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-900 font-medium truncate">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 items-start">
          {/* Left Column: Vertical Thumbnails + Main Image */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="w-full lg:w-7/12 flex flex-col-reverse sm:flex-row gap-4 items-start"
          >
            {/* Vertical Thumbnails */}
            {thumbnailGallery.length > 0 && (
              <div className="flex sm:flex-col gap-3 w-full sm:w-20 shrink-0 overflow-x-auto sm:overflow-visible">
                {thumbnailGallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl || "")}
                    className={`relative w-20 h-24 sm:w-full sm:h-24 rounded-lg overflow-hidden border-2 transition-all bg-neutral-100 shrink-0 ${
                      displayImage === imgUrl ? "border-brand-600 shadow-md scale-95" : "border-neutral-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl || ""} alt={`${product.name} thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Display Image */}
            <div className="w-full aspect-3/4 sm:aspect-4/5 bg-neutral-50 overflow-hidden relative rounded-2xl border border-neutral-100 shadow-sm">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={`${product.name} - ${selectedColor}`}
                  className="w-full h-full object-cover transition-opacity duration-500"
                  key={displayImage}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400 font-medium">No Image</div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Product Info & Buy Controls */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="w-full lg:w-5/12 flex flex-col pt-2"
          >
            <div className="mb-6 border-b border-neutral-100 pb-6">
              {product.category_name && (
                <span className="text-xs font-bold tracking-widest text-brand-600 uppercase mb-2 block">
                  {product.category_name}
                </span>
              )}
              <h1 className="text-2xl md:text-4xl font-bold text-neutral-900 mb-3 tracking-tight">
                {product.name}
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-brand-600 mb-6">
                {Number(product.price || 0).toFixed(0)} JDs
              </p>
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Description</h4>
                <p className="text-sm md:text-base text-neutral-600 leading-relaxed text-justify">
                  {product.description || "Experience effortless performance and refined professional style. Designed for comfort, movement, and durability through your longest shifts."}
                </p>
              </div>
            </div>

            {/* Colors - Circular Swatches matching Figma */}
            {availableColors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                  Color: <span className="font-normal capitalize text-brand-600">{selectedColor}</span>
                </h3>
                <div className="flex items-center gap-3.5 flex-wrap">
                  {availableColors.map((color) => {
                    const hex = COLOR_HEX_MAP[color] || "#024b5c";
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        title={color}
                        className={`w-7 h-7 rounded-full transition-all border border-neutral-300 shadow-sm relative ${
                          isSelected ? "ring-2 ring-offset-2 ring-brand-600 scale-110" : "hover:scale-105 opacity-80 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {availableSizes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                  Size: <span className="font-normal text-brand-600">{selectedSize}</span>
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 border transition-all rounded-lg text-xs font-bold uppercase ${
                        selectedSize === size
                          ? "border-brand-600 bg-brand-50 text-brand-700 shadow-sm"
                          : "border-neutral-200 text-neutral-700 hover:border-brand-600 hover:text-brand-600"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector matching Figma (- 1 + pill) */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">Quantity</h3>
              <div className="inline-flex items-center border border-neutral-200 rounded-lg bg-neutral-50 px-2 py-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-brand-600 font-bold text-lg transition-colors"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-sm text-neutral-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-brand-600 font-bold text-lg transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add To Basket Button matching Figma */}
            <div className="mt-4">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full py-6 text-sm font-bold uppercase tracking-widest rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                ADD TO BASKET
              </Button>
            </div>
          </motion.div>
        </div>

        {/* You May Also Like Section matching Figma */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-neutral-200">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">
              <span className="text-brand-500/70 font-normal">You May </span>
              <span className="text-brand-600">Also Like</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {relatedProducts.map((relProd) => (
                <Link
                  key={relProd.id}
                  href={`/products/${relProd.slug}`}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-full aspect-3/4 bg-neutral-100 overflow-hidden relative">
                    {relProd.image ? (
                      <img
                        src={relProd.image}
                        alt={relProd.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400 font-medium">No Image</div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col">
                    <h3 className="text-sm font-medium text-neutral-700 group-hover:text-brand-600 transition-colors truncate mb-1">
                      {relProd.name}
                    </h3>
                    <p className="text-brand-600 font-bold text-base">
                      {Number(relProd.price || 0).toFixed(0)} JOD
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
