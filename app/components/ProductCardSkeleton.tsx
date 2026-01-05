export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-sm p-2 sm:p-3 h-full">
      <div className="aspect-square w-full animate-pulse bg-gray-200 mb-2 sm:mb-3" />
      <div className="flex flex-1 flex-col gap-1.5 sm:gap-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-1/4 animate-pulse rounded bg-gray-200" />
        <div className="h-9 w-full mt-2 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

