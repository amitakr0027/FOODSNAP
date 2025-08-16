import { BarChart3 } from "lucide-react"

export default function AnalysisLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-lime-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-lime-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Product...</h2>
        <div className="w-48 bg-gradient-to-r from-orange-100 to-lime-100 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 via-yellow-500 to-lime-500 h-2 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
