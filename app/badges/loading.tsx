import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function BadgesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b bg-white/95 border-orange-100">
        <div className="flex items-center justify-between px-3 sm:px-4 py-3">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="w-32 sm:w-48 h-6" />
          </div>
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
      </header>

      {/* Stats Overview Skeleton */}
      <section className="px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-3 sm:p-4 text-center">
                <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-2" />
                <Skeleton className="w-12 h-6 sm:h-8 mx-auto mb-1" />
                <Skeleton className="w-16 h-4 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Search and Filters Skeleton */}
      <section className="px-3 sm:px-4 pb-4 sm:pb-6">
        <div className="max-w-6xl mx-auto space-y-3 sm:space-y-4">
          <Skeleton className="w-full h-10 sm:h-12" />

          {/* Mobile Filter Toggle */}
          <div className="flex items-center justify-between sm:hidden">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-20 h-8" />
          </div>

          {/* Desktop Filters */}
          <div className="hidden sm:flex space-x-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-24 h-8" />
            ))}
          </div>

          <div className="hidden sm:flex space-x-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-16 h-8" />
            ))}
          </div>
        </div>
      </section>

      {/* Badges Grid Skeleton */}
      <main className="px-3 sm:px-4 pb-32 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="relative mb-3 sm:mb-4">
                  <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full mx-auto" />
                  <Skeleton className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full" />
                </div>

                <div className="text-center mb-3 sm:mb-4">
                  <Skeleton className="w-24 h-5 sm:h-6 mx-auto mb-1" />
                  <Skeleton className="w-full h-4 mx-auto mb-2" />
                  <Skeleton className="w-16 h-4 mx-auto" />
                </div>

                <div className="mb-3 sm:mb-4">
                  <div className="flex justify-between mb-1">
                    <Skeleton className="w-12 h-3" />
                    <Skeleton className="w-8 h-3" />
                  </div>
                  <Skeleton className="w-full h-2 rounded-full" />
                </div>

                <Skeleton className="w-20 h-3 mx-auto mb-3" />
                <Skeleton className="w-full h-8" />

                <div className="absolute top-2 left-2">
                  <Skeleton className="w-12 h-5 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
