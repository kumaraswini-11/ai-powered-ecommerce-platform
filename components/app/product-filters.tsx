"use client";

import { X, Search } from "lucide-react";
import { useQueryState, parseAsInteger, parseAsBoolean } from "nuqs";

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
  // nuqs State Definitions
  const [q, setQ] = useQueryState("q", { defaultValue: "", shallow: false });
  const [category, setCategory] = useQueryState("category", {
    defaultValue: "all",
    shallow: false,
  });
  const [color, setColor] = useQueryState("color", {
    defaultValue: "all",
    shallow: false,
  });
  const [material, setMaterial] = useQueryState("material", {
    defaultValue: "all",
    shallow: false,
  });
  const [inStock, setInStock] = useQueryState(
    "inStock",
    parseAsBoolean.withDefault(false).withOptions({ shallow: false }),
  );
  const [sort, setSort] = useQueryState("sort", {
    defaultValue: "name",
    shallow: false,
  });

  // Price states (nuqs handles string-to-number conversion)
  const [minPrice, setMinPrice] = useQueryState(
    "minPrice",
    parseAsInteger.withDefault(0).withOptions({ shallow: false }),
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    "maxPrice",
    parseAsInteger.withDefault(5000).withOptions({ shallow: false }),
  );

  const activeFiltersCount = [
    q,
    category !== "all" ? category : null,
    color !== "all" ? color : null,
    material !== "all" ? material : null,
    inStock ? "true" : null,
    minPrice > 0 ? "true" : null,
  ].filter(Boolean).length;

  const handleClearAll = () => {
    // Resetting to null removes the key from the URL
    setQ(null);
    setCategory(null);
    setColor(null);
    setMaterial(null);
    setInStock(null);
    setMinPrice(null);
    setMaxPrice(null);
    setSort(null);
  };

  return (
    <div
      className={cn(
        "space-y-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950",
        // isPending && "opacity-70",
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
            onClick={handleClearAll}
            className="text-accent mt-1 w-full bg-amber-500 text-xs hover:bg-amber-600"
          >
            <X className="mr-1 size-3" /> Clear All
          </Button>
        </div>
      )}

      {/* Search */}
      <FilterSection title="Search" isActive={!!q} onClear={() => setQ(null)}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            setQ(formData.get("q") as string);
          }}
          className="flex gap-1"
        >
          <Input
            name="q"
            placeholder="Search products..."
            defaultValue={q}
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
        isActive={category !== "all"}
        onClear={() => setCategory(null)}
      >
        <Select value={category} onValueChange={(v) => setCategory(v)}>
          <SelectTrigger
            className={cn(
              "h-8 text-sm",
              category !== "all" && "border-amber-500 ring-1 ring-amber-500",
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
        isActive={color !== "all"}
        onClear={() => setColor(null)}
      >
        <Select value={color} onValueChange={(v) => setColor(v)}>
          <SelectTrigger
            className={cn(
              "h-8 text-sm",
              color !== "all" && "border-amber-500 ring-1 ring-amber-500",
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
        isActive={material !== "all"}
        onClear={() => setMaterial(null)}
      >
        <Select value={material} onValueChange={(v) => setMaterial(v)}>
          <SelectTrigger
            className={cn(
              "h-8 text-sm",
              material !== "all" && "border-amber-500 ring-1 ring-amber-500",
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
        title={`Price: £${minPrice} - £${maxPrice}`}
        isActive={minPrice > 0 || maxPrice < 5000}
        onClear={() => {
          setMinPrice(null);
          setMaxPrice(null);
        }}
      >
        <Slider
          min={0}
          max={5000}
          step={100}
          value={[minPrice, maxPrice]}
          onValueChange={([min, max]) => {
            // Update local state is handled by nuqs hooks directly
            setMinPrice(min);
            setMaxPrice(max);
          }}
          className="mt-2"
        />
      </FilterSection>

      {/* Stock Toggle */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="inStock"
          checked={inStock}
          onCheckedChange={(checked) => setInStock(!!checked)}
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
        <Select value={sort} onValueChange={(v) => setSort(v)}>
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
