"use client";

import { PanelLeftClose, PanelLeft } from "lucide-react";
import { useState } from "react";

import { ProductFilters } from "@/components/product-filters";
import { ProductGrid } from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  ALL_CATEGORIES_QUERYResult,
  FILTER_PRODUCTS_BY_NAME_QUERYResult,
} from "@/sanity.types";

interface ProductSectionProps {
  categories: ALL_CATEGORIES_QUERYResult;
  products: FILTER_PRODUCTS_BY_NAME_QUERYResult;
  searchQuery: string;
}

export function ProductSection({
  categories,
  products,
  searchQuery,
}: ProductSectionProps) {
  const [filtersOpen, setFiltersOpen] = useState(true);

  return (
    <section className="flex flex-col gap-6">
      {/* Result Stats & Filter toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {products.length}
          </span>{" "}
          {products.length === 1 ? "product" : "products"} found
          {searchQuery && (
            <>
              {" "}
              for &quot;<span className="font-medium">{searchQuery}</span>&quot;
            </>
          )}
        </div>
        {/* Filter toggle button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="gap-2 border-zinc-300 bg-white shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          aria-label={filtersOpen ? "Hide filters" : "Show filters"}
        >
          {filtersOpen ? (
            <>
              <PanelLeftClose className="size-4" />
              <span className="hidden sm:inline">Hide Filters</span>
            </>
          ) : (
            <>
              <PanelLeft className="size-4" />
              <span className="hidden sm:inline">Show Filters</span>
            </>
          )}
        </Button>
      </div>

      {/* Main content area */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters - completely hidden when collapsed on desktop */}
        <aside
          className={cn(
            "shrink-0 transition-all duration-300 ease-in-out lg:block",
            filtersOpen
              ? "w-full opacity-100 lg:w-72"
              : "hidden opacity-0 lg:hidden",
          )}
        >
          <ProductFilters categories={categories} />
        </aside>

        {/* Product Grid - expands to full width when filters hidden */}
        <main className="flex-1"></main>
      </div>
    </section>
  );
}
