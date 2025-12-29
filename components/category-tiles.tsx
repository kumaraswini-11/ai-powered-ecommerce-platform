"use client";

import { Grid2x2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";

interface CategoryTilesProps {
  categories: ALL_CATEGORIES_QUERYResult;
  activeCategory?: string;
}

export function CategoryTiles({
  categories,
  activeCategory,
}: CategoryTilesProps) {
  return (
    <div className="relative">
      {/* Horizontal scrolling container */}
      <nav
        aria-label="Product categories"
        className="scrollbar-hide flex gap-4 overflow-x-auto py-4 pr-4 pl-8 sm:pr-6 sm:pl-12 lg:pr-8 lg:pl-10"
      >
        {/* All Products Tile */}
        <CategoryTile
          title="All Products"
          href="/"
          isActive={!activeCategory}
          icon={<Grid2x2 className="size-12 text-white/60 sm:size-12" />}
          gradient="from-zinc-800 to-zinc-900 dark:from-zinc-700 dark:to-zinc-800"
        />

        {/* Dynamic Category Tiles */}
        {categories.map((category) => (
          <CategoryTile
            key={category._id}
            title={category.title ?? "Category"}
            href={`/?category=${category.slug}`}
            isActive={activeCategory === category.slug}
            imageUrl={category.image?.asset?.url ?? undefined}
          />
        ))}
      </nav>
    </div>
  );
}

function CategoryTile({
  title,
  href,
  isActive,
  imageUrl,
  icon,
  gradient,
}: {
  title: string;
  href: string;
  isActive: boolean;
  imageUrl?: string;
  icon?: React.ReactNode;
  gradient?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group ring-offset-background focus-visible:ring-ring relative shrink-0 overflow-hidden rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden",
        isActive
          ? "ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-zinc-900"
          : "hover:ring-2 hover:ring-zinc-300 hover:ring-offset-2 dark:hover:ring-zinc-600 dark:hover:ring-offset-zinc-900",
      )}
    >
      <div className="relative h-32 w-56 sm:h-56 sm:w-80">
        {/* Background Layer */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 224px, (max-width: 1024px) 288px, 320px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority={isActive} // Load active category image faster
          />
        ) : (
          <div
            className={cn(
              "absolute inset-0 bg-linear-to-br transition-colors duration-300",
              gradient ?? "from-amber-500 to-orange-600",
            )}
          />
        )}

        {/* Icon Overlay (e.g., Grid icon) */}
        {icon && (
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
        )}

        {/* Scrim/Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

        {/* Label */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-sm font-semibold text-white drop-shadow-md sm:text-base">
            {title}
          </p>
        </div>

        {/* Status Indicator */}
        {isActive && (
          <div className="absolute top-3 right-3 flex size-2">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"
              aria-hidden="true"
            />
            <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
          </div>
        )}
      </div>
    </Link>
  );
}
