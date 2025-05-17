import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-1 px-1 sm:px-2 md:px-6 lg:px-10">
      <div className="w-full">
        <div className="px-2 w-full sticky top-1 z-10">
          <div className="grid border-2 grid-cols-3 gap-2 p-2">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-10 rounded-md" />
            ))}
          </div>
        </div>
        <div className="w-full mx-auto p-6 bg-white rounded-lg border-2 my-2">
          <Skeleton className="h-6 w-1/3 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="relative">
                <div className="block h-full ring-2 ring-transparent rounded-lg">
                  <div className="h-full border overflow-hidden rounded-lg">
                    <Skeleton className="h-40 w-full bg-gray-100" />
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
