import { Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-gray-300 mb-4">404</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist. Let's get you back to scanning!</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="bg-gradient-to-r from-orange-500 to-lime-500 hover:from-orange-600 hover:to-lime-600 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link href="/scan">
            <Button
              variant="outline"
              className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Search className="w-4 h-4 mr-2" />
              Start Scanning
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
