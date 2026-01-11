import { ShoppingBag } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface StackedProductImagesProps {
  images: string[];
  /** Total number of items (used to calculate "+X more" count) */
  totalCount?: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to animate on hover (requires parent with `group` class) */
  hoverScale?: boolean;
}

const sizeConfig = {
  sm: {
    container: "h-12 w-12",
    single: "100%",
    stacked: "36px",
    offset: 4,
    icon: "h-5 w-5",
    fontSize: "text-[10px]",
    imageSizes: "48px",
  },
  md: {
    container: "h-16 w-16",
    single: "100%",
    stacked: "48px",
    offset: 5,
    icon: "h-6 w-6",
    fontSize: "text-xs",
    imageSizes: "64px",
  },
  lg: {
    container: "h-20 w-20",
    single: "100%",
    stacked: "56px",
    offset: 6,
    icon: "h-8 w-8",
    fontSize: "text-xs",
    imageSizes: "80px",
  },
} as const;

export function StackedProductImages({
  images,
  totalCount,
  size = "sm",
  hoverScale = true,
}: StackedProductImagesProps) {
  const config = sizeConfig[size];

  const displayImages = images.slice(0, 3);
  const effectiveTotal = totalCount ?? images.length;

  const extraCount = Math.max(0, effectiveTotal - displayImages.length);

  const hoverClass = hoverScale
    ? "transition-transform duration-200 group-hover:scale-105"
    : "";

  // Empty state
  if (displayImages.length === 0) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center",
          config.container,
        )}
        aria-label="No products"
      >
        <div
          className={`flex h-full w-full items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-700 ${hoverClass}`}
        >
          <ShoppingBag
            className={cn(config.icon, "text-zinc-400")}
            aria-hidden
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        config.container,
      )}
      aria-label={`${displayImages.length} product images`}
    >
      <div className="relative h-full w-full">
        {displayImages.map((imageUrl, index) => {
          const isSingle = displayImages.length === 1;

          return (
            <div
              key={`${imageUrl}-${index}`}
              className={cn(
                "absolute overflow-hidden rounded-lg border-2 border-white bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-700",
                hoverClass,
              )}
              style={{
                width: isSingle ? config.single : config.stacked,
                height: isSingle ? config.single : config.stacked,
                top: isSingle ? 0 : `${index * config.offset}px`,
                left: isSingle ? 0 : `${index * config.offset}px`,
                zIndex: displayImages.length - index,
              }}
            >
              <Image
                src={imageUrl}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
                sizes={config.imageSizes}
              />
            </div>
          );
        })}

        {extraCount > 0 && displayImages.length > 1 && (
          <div
            className={cn(
              "absolute flex items-center justify-center rounded-lg border-2 border-white bg-zinc-200 font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-600 dark:text-zinc-300",
              config.fontSize,
            )}
            style={{
              width: config.stacked,
              height: config.stacked,
              top: `${Math.min(displayImages.length, 2) * config.offset}px`,
              left: `${Math.min(displayImages.length, 2) * config.offset}px`,
              zIndex: 0,
            }}
            aria-label={`${extraCount} more products`}
          >
            +{extraCount}
          </div>
        )}
      </div>
    </div>
  );
}
