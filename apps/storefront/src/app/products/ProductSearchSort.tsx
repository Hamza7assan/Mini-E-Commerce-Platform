"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Category } from "@/types";

interface ProductSearchSortProps {
  categories?: Category[];
  selectedCategory?: string;
  totalResults?: number;
}

export function ProductSearchSort({ categories = [], selectedCategory = "", totalResults = 0 }: ProductSearchSortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  // Update URL params
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = useDebouncedCallback((term: string) => {
    router.push(`?${createQueryString("q", term)}`);
  }, 500);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  };

  const onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`?${createQueryString("sort", e.target.value)}`);
  };

  const onCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`?${createQueryString("category", e.target.value)}`);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-6 border-b border-neutral-200 mb-8 bg-white">
      {/* Left side: Category dropdown & Search input */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* Category select pill */}
        <div className="relative shrink-0">
          <select
            className="appearance-none bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-full px-5 py-2 pr-10 text-xs font-semibold uppercase tracking-wider text-neutral-700 focus:outline-none focus:border-brand-600 transition-colors cursor-pointer"
            value={selectedCategory}
            onChange={onCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Search input */}
        <div className="relative grow sm:grow-0 sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <input
            type="text"
            placeholder="Search Products..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:bg-white focus:border-brand-600 text-xs font-medium text-neutral-800 transition-all"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
      </div>

      {/* Right side: Product Count & Sort dropdown */}
      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-neutral-100">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">
          {totalResults} {totalResults === 1 ? "Product" : "Products"}
        </span>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-xs text-neutral-500 font-semibold uppercase tracking-wider whitespace-nowrap">
            Sort By:
          </label>
          <div className="relative">
            <select
              id="sort"
              className="appearance-none bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-full px-4 py-2 pr-9 text-xs font-semibold text-neutral-700 focus:outline-none focus:border-brand-600 transition-colors cursor-pointer"
              defaultValue={searchParams.get("sort") || ""}
              onChange={onSortChange}
            >
              <option value="">Featured</option>
              <option value="-id">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
