"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";


export function ProductSearchSort() {
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

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-neutral-100">
      <div className="relative w-full sm:max-w-xs">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <input
          type="text"
          placeholder="Search Products"
          className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-brand-500 text-sm transition-all"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <label htmlFor="sort" className="text-sm text-neutral-500 font-medium whitespace-nowrap">Sort By:</label>
        <select
          id="sort"
          className="w-full sm:w-auto pl-3 pr-8 py-2 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm bg-white"
          defaultValue={searchParams.get("sort") || ""}
          onChange={onSortChange}
        >
          <option value="">Sort Featured</option>
          <option value="price">Sort Price Low High</option>
          <option value="-price">Sort Price High Low</option>
          <option value="-id">Sort Newest</option>
          <option value="name">Sort Name Az</option>
        </select>
      </div>
    </div>
  );
}
