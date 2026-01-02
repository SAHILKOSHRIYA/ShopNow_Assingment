"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { useGetProductQuery } from "@/lib/api/productsApi";
import { ProductDetailActions } from "./product-actions";
import { ThemeToggle } from "../../components/ThemeToggle";

type Props = {
  params: Promise<{ id: string }>;
};

export default function ProductPage({ params }: Props) {
  const { id } = use(params);
  const { data: product, isLoading, error } = useGetProductQuery(id);

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="w-fit text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            ← Back to products
          </Link>
          <ThemeToggle />
        </div>
        <div className="grid gap-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-2">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          <div className="flex flex-col gap-4">
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
            <div className="h-8 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
            <div className="h-20 w-full bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
            <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="w-fit text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            ← Back to products
          </Link>
          <ThemeToggle />
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">
            Failed to load product. Please try again.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="w-fit text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← Back to products
        </Link>
        <ThemeToggle />
      </div>
      <div className="grid gap-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={product.image || product.imageUrl || ""}
            alt={product.title || product.name || "Product"}
            fill
            sizes="(min-width: 1024px) 40vw, 80vw"
            className="object-contain p-6"
          />
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {product.category}
          </p>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {product.title || product.name}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {product.description}
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            ${product.price.toFixed(2)}
          </p>
          <ProductDetailActions product={product} />
        </div>
      </div>
    </main>
  );
}


