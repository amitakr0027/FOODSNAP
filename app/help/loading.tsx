import { Skeleton } from "@/components/ui/skeleton"

export default function HelpLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-6 w-24" />
          <div className="text-center">
            <Skeleton className="h-8 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="w-16"></div>
        </div>

        {/* Hero Section Skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-80 mx-auto mb-8" />

          {/* Search Bar Skeleton */}
          <Skeleton className="h-12 w-full max-w-lg mx-auto mb-6" />

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4">
                <Skeleton className="h-5 w-5 mx-auto mb-2" />
                <Skeleton className="h-6 w-8 mx-auto mb-1" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Categories Skeleton */}
        <div className="mb-12">
          <Skeleton className="h-6 w-48 mx-auto mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-lg">
                <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                <Skeleton className="h-5 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-40 mx-auto mb-3" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Filter Pills Skeleton */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24" />
          ))}
        </div>

        {/* FAQs Skeleton */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-80" />
                  <Skeleton className="h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
          <Skeleton className="h-6 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center p-4">
                <Skeleton className="h-10 w-10 mx-auto mb-3" />
                <Skeleton className="h-5 w-24 mx-auto mb-2" />
                <Skeleton className="h-4 w-32 mx-auto mb-3" />
                <Skeleton className="h-8 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
