import { fetchFromOFF, searchOFF } from "./openFoodFacts"
import { rankResults } from "./rankResults"
import { getCachedResult, setCachedResult } from "./search/searchCache"

export async function smartSearch(input: string) {
  const query = input.trim()
  if (!query) return []

  // 🧠 Cache first
  const cached = getCachedResult(query)
  if (cached) return cached

  let results: any[] = []

  // 🔢 Barcode
  if (/^\d{8,14}$/.test(query)) {
    const product = await fetchFromOFF(query)
    results = product ? [product] : []
  } else {
    // 🔤 Text search
    const [inResults, globalResults] = await Promise.all([
      searchOFF(query, "IN"),
      searchOFF(query, "GLOBAL"),
    ])

    results = rankResults(query, [...inResults, ...globalResults])
  }

  setCachedResult(query, results)
  return results
}
