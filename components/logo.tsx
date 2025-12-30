import { Package } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      aria-label="Go to homepage"
      className="flex items-center gap-2 transition-opacity hover:opacity-90"
    >
      <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100">
        <Package className="size-5 text-white dark:text-zinc-900" />
      </div>
      <span className="hidden font-bold tracking-tight text-zinc-900 sm:block dark:text-zinc-100">
        COMMERCE <span className="text-amber-600">STORE</span>
      </span>
    </Link>
  );
}
