"use client";

import { X, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { COLORS, MATERIALS, SORT_OPTIONS } from "@/lib/constants/filters";
import { cn } from "@/lib/utils";
import type { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";

export function ProductFilters({
  categories,
}: {
  categories: ALL_CATEGORIES_QUERYResult;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Derive initial price range from URL params
  const urlMinPrice = Number(searchParams.get("minPrice")) || 0;
  const urlMaxPrice = Number(searchParams.get("maxPrice")) || 5000;

  // Price State
  const [priceRange, setPriceRange] = useState<[number, number]>([
    urlMinPrice,
    urlMaxPrice,
  ]);

  const updateParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all" || value === 0) params.delete(key);
      else params.set(key, String(value));
    });

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  const activeFiltersCount = [
    "q",
    "category",
    "color",
    "material",
    "inStock",
    "minPrice",
  ].filter((k) => searchParams.has(k)).length;

  return (
    <div
      className={cn(
        "space-y-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950",
        isPending && "opacity-70",
      )}
    >
      {activeFiltersCount > 0 && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-2 dark:border-amber-700 dark:bg-amber-950">
          <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
            {activeFiltersCount} active filter
            {activeFiltersCount !== 1 ? "s" : ""}
          </p>
          <Button
            size="sm"
            onClick={() => router.push("/", { scroll: false })}
            className="text-accent mt-1 w-full bg-amber-500 text-xs hover:bg-amber-600"
          >
            <X className="mr-1 size-3" /> Clear All
          </Button>
        </div>
      )}

      {/* Search */}
      <FilterSection
        title="Search"
        isActive={!!searchParams.get("q")}
        onClear={() => updateParams({ q: null })}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateParams({
              q: new FormData(e.currentTarget).get("q") as string,
            });
          }}
          className="flex gap-1"
        >
          <Input
            name="q"
            placeholder="Search products..."
            defaultValue={searchParams.get("q") ?? ""}
            className="h-8 text-sm"
          />
          <Button
            type="submit"
            size="sm"
            variant="secondary"
            className="h-8 px-2"
          >
            <Search className="size-3" />
          </Button>
        </form>
      </FilterSection>

      {/* Category */}
      <FilterSection
        title="Category"
        isActive={!!searchParams.get("category")}
        onClear={() => updateParams({ category: null })}
      >
        <Select
          value={searchParams.get("category") || "all"}
          onValueChange={(v) => updateParams({ category: v })}
        >
          <SelectTrigger
            className={cn(
              "h-8 text-sm",
              searchParams.get("category") &&
                "border-amber-500 ring-1 ring-amber-500",
            )}
          >
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c._id} value={c.slug ?? ""}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      {/* Color Filter */}
      <FilterSection
        title="Color"
        isActive={!!searchParams.get("color")}
        onClear={() => updateParams({ color: null })}
      >
        <Select
          value={searchParams.get("color") || "all"}
          onValueChange={(v) => updateParams({ color: v })}
        >
          <SelectTrigger
            className={cn(
              "h-8 text-sm",
              searchParams.get("color") &&
                "border-amber-500 ring-1 ring-amber-500",
            )}
          >
            <SelectValue placeholder="All Colors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Colors</SelectItem>
            {COLORS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      {/* Material Filter */}
      <FilterSection
        title="Material"
        isActive={!!searchParams.get("material")}
        onClear={() => updateParams({ material: null })}
      >
        <Select
          value={searchParams.get("material") || "all"}
          onValueChange={(v) => updateParams({ material: v })}
        >
          <SelectTrigger
            className={cn(
              "h-8 text-sm",
              searchParams.get("material") &&
                "border-amber-500 ring-1 ring-amber-500",
            )}
          >
            <SelectValue placeholder="All Materials" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Materials</SelectItem>
            {MATERIALS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title={`Price: £${priceRange[0]} - £${priceRange[1]}`}
        isActive={priceRange[0] > 0 || priceRange[1] < 5000}
        onClear={() => updateParams({ minPrice: null, maxPrice: null })}
      >
        <Slider
          min={0}
          max={5000}
          step={100}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          onValueCommit={([min, max]) =>
            updateParams({ minPrice: min, maxPrice: max })
          }
          className="mt-2"
        />
      </FilterSection>

      {/* Stock Toggle */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="inStock"
          checked={searchParams.get("inStock") === "true"}
          onCheckedChange={(checked) =>
            updateParams({ inStock: checked ? "true" : null })
          }
          className="text-amber-500 focus:ring-amber-500"
        />
        <label htmlFor="inStock" className="cursor-pointer text-sm font-medium">
          In Stock Only
        </label>
      </div>

      {/* Sort */}
      <div className="border-t pt-3">
        <span className="mb-1 block text-xs font-bold tracking-wider text-zinc-500 uppercase">
          Sort Results
        </span>
        <Select
          value={searchParams.get("sort") || "name"}
          onValueChange={(v) => updateParams({ sort: v })}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function FilterSection({
  title,
  isActive,
  onClear,
  children,
}: {
  title: string;
  isActive: boolean;
  onClear: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-sm font-medium",
            isActive ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-600",
          )}
        >
          {title}
          {isActive && (
            <Badge className="ml-1 h-4 bg-amber-500 px-1 text-[10px]">
              Active
            </Badge>
          )}
        </span>
        {isActive && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="size-6 rounded-full text-zinc-400 hover:text-zinc-600"
            aria-label={`Clear ${title} filter`}
          >
            <X className="size-3" />
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
