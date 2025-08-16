import { useState, useCallback, useRef } from "react"
import { PerformanceOptimizer } from "@/lib/performance-utils"

interface Product {
  product_name: string
  image_thumb_url?: string
  nutriments?: Record<string, number>
  brands?: string
  code?: string
  nutrition_grades_tags?: string[]
  ingredients_text?: string
  image_url?: string
  [key: string]: any
}

// Ultra-fast fuzzy matching utility
class FuzzyMatcher {
  // Simplified distance calculation for speed
  static quickDistance(str1: string, str2: string): number {
    if (str1.length === 0) return str2.length
    if (str2.length === 0) return str1.length
    
    // Use a simplified approach for speed
    let distance = Math.abs(str1.length - str2.length)
    const minLength = Math.min(str1.length, str2.length)
    
    for (let i = 0; i < minLength; i++) {
      if (str1[i] !== str2[i]) distance++
    }
    
    return distance
  }

  // Lightning-fast text normalization
  static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim()
  }

  // Ultra-fast fuzzy matching
  static fuzzyMatch(query: string, productName: string): boolean {
    const normalizedQuery = this.normalizeText(query)
    const normalizedProduct = this.normalizeText(productName)
    
    // Instant exact match check
    if (normalizedProduct.includes(normalizedQuery)) return true
    
    // Quick word-based matching
    const queryWords = normalizedQuery.split(' ')
    const productWords = normalizedProduct.split(' ')
    
    let matches = 0
    for (const queryWord of queryWords) {
      if (queryWord.length < 2) continue
      
      for (const productWord of productWords) {
        if (productWord.includes(queryWord) || queryWord.includes(productWord)) {
          matches++
          break
        }
      }
    }
    
    // At least half the words should match
    return matches >= Math.ceil(queryWords.length * 0.5)
  }

  // Fast brand matching
  static matchBrand(query: string, brands: string): boolean {
    if (!brands) return false
    const normalizedQuery = this.normalizeText(query)
    const normalizedBrands = this.normalizeText(brands)
    
    return normalizedBrands.includes(normalizedQuery)
  }

  // Quick English detection
  static isEnglishLike(text: string): boolean {
    // Simple check - if it contains mostly ASCII characters
    const asciiChars = text.match(/[a-zA-Z0-9\s]/g)?.length || 0
    return asciiChars / text.length > 0.8
  }
}

// Ultra-optimized search hook
export function useOptimizedSearch() {
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const searchCacheRef = useRef<Map<string, { results: Product[], timestamp: number }>>(new Map())

  // Ultra-fast fetch with aggressive caching
  const fetchWithCache = PerformanceOptimizer.memoize(
    async (url: string, timeout = 2500): Promise<any> => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            "User-Agent": "FoodSnap/1.0",
            Accept: "application/json",
          },
        })
        clearTimeout(timeoutId)

        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return await response.json()
      } catch (error) {
        clearTimeout(timeoutId)
        throw error
      }
    },
    (url: string) => `fetch_${url}`,
    900000 // 15 minutes cache for maximum speed
  )

  // Lightning-fast barcode search
  const fetchProductByBarcode = useCallback(async (barcode: string): Promise<Product[]> => {
    const cleanBarcode = barcode.trim()
    const cacheKey = `barcode_${cleanBarcode}`
    
    // Check cache first
    const cached = searchCacheRef.current.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < 600000) { // 10 min cache
      return cached.results
    }

    // Try Indian API first (usually faster for local products)
    try {
      const data = await fetchWithCache(
        `https://in.openfoodfacts.org/api/v0/product/${cleanBarcode}.json`,
        2000 // 2 second timeout
      )
      if (data.status === 1 && data.product) {
        const results = [data.product]
        searchCacheRef.current.set(cacheKey, { results, timestamp: Date.now() })
        return results
      }
    } catch (error) {
      // Fallback to world API
      try {
        const data = await fetchWithCache(
          `https://world.openfoodfacts.org/api/v0/product/${cleanBarcode}.json`,
          2000
        )
        if (data.status === 1 && data.product) {
          const results = [data.product]
          searchCacheRef.current.set(cacheKey, { results, timestamp: Date.now() })
          return results
        }
      } catch (fallbackError) {
        // Cache empty result to avoid repeated requests
        searchCacheRef.current.set(cacheKey, { results: [], timestamp: Date.now() })
      }
    }
    
    return []
  }, [fetchWithCache])

  // Ultra-fast name search with smart optimization
  const fetchProductByName = useCallback(async (query: string): Promise<Product[]> => {
    const normalizedQuery = FuzzyMatcher.normalizeText(query)
    if (normalizedQuery.length < 2) return []

    const cacheKey = `search_${normalizedQuery}`
    
    // Check cache first for instant results
    const cached = searchCacheRef.current.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 min cache
      return cached.results
    }

    // Single API call strategy - start with Indian API for speed
    try {
      const data = await fetchWithCache(
        `https://in.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=15&sort_by=unique_scans_n`,
        2500 // 2.5 second timeout
      )

      let results: Product[] = []
      const seenProducts = new Set<string>()

      if (data?.products && Array.isArray(data.products)) {
        // Ultra-fast filtering
        results = data.products
          .filter((product: Product) => {
            if (!product.product_name || typeof product.product_name !== "string") return false
            
            const productName = product.product_name.trim()
            if (productName.length === 0) return false
            
            // Quick duplicate check
            const productKey = FuzzyMatcher.normalizeText(productName)
            if (seenProducts.has(productKey)) return false
            
            // Fast matching
            const nameMatch = FuzzyMatcher.fuzzyMatch(query, productName)
            const brandMatch = product.brands ? FuzzyMatcher.matchBrand(query, product.brands) : false
            
            if (nameMatch || brandMatch) {
              seenProducts.add(productKey)
              return true
            }
            
            return false
          })
          .slice(0, 10) // Limit for speed
      }

      // If we don't have enough results from Indian API, quickly try world API
      if (results.length < 5) {
        try {
          const worldData = await fetchWithCache(
            `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10&sort_by=unique_scans_n`,
            2000 // Even faster timeout for fallback
          )

          if (worldData?.products && Array.isArray(worldData.products)) {
            const additionalResults = worldData.products
              .filter((product: Product) => {
                if (!product.product_name || typeof product.product_name !== "string") return false
                
                const productName = product.product_name.trim()
                if (productName.length === 0) return false
                
                const productKey = FuzzyMatcher.normalizeText(productName)
                if (seenProducts.has(productKey)) return false
                
                const nameMatch = FuzzyMatcher.fuzzyMatch(query, productName)
                const brandMatch = product.brands ? FuzzyMatcher.matchBrand(query, product.brands) : false
                
                if (nameMatch || brandMatch) {
                  seenProducts.add(productKey)
                  return true
                }
                
                return false
              })
              .slice(0, 5) // Limit additional results

            results = [...results, ...additionalResults]
          }
        } catch (worldError) {
          // Ignore world API errors, use what we have
        }
      }

      // Quick sorting by relevance
      const sortedResults = results
        .sort((a, b) => {
          const aName = FuzzyMatcher.normalizeText(a.product_name)
          const bName = FuzzyMatcher.normalizeText(b.product_name)
          const normalizedQuery = FuzzyMatcher.normalizeText(query)
          
          // Exact matches first
          const aExact = aName.includes(normalizedQuery) ? 1 : 0
          const bExact = bName.includes(normalizedQuery) ? 1 : 0
          if (aExact !== bExact) return bExact - aExact
          
          // English-like products preferred
          const aEnglish = FuzzyMatcher.isEnglishLike(a.product_name) ? 1 : 0
          const bEnglish = FuzzyMatcher.isEnglishLike(b.product_name) ? 1 : 0
          if (aEnglish !== bEnglish) return bEnglish - aEnglish
          
          // Shorter names
          return a.product_name.length - b.product_name.length
        })
        .slice(0, 8) // Final limit for speed

      // Cache results
      searchCacheRef.current.set(cacheKey, { results: sortedResults, timestamp: Date.now() })
      
      return sortedResults

    } catch (error) {
      console.warn("Search failed:", error)
      // Cache empty result to avoid repeated failed requests
      searchCacheRef.current.set(cacheKey, { results: [], timestamp: Date.now() })
      return []
    }
  }, [fetchWithCache])

  // Ultra-fast debounced search
  const debouncedSearch = useCallback(
    PerformanceOptimizer.debounce(async (query: string) => {
      const trimmedQuery = query.trim()
      if (!trimmedQuery || trimmedQuery.length < 2) {
        setSuggestions([])
        return
      }

      // Cancel previous request immediately
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      setIsSearching(true)

      try {
        // Lightning-fast barcode detection
        const isBarcode = /^\d{8,14}$/.test(trimmedQuery.replace(/\s/g, ''))
        const results = isBarcode 
          ? await fetchProductByBarcode(trimmedQuery.replace(/\s/g, ''))
          : await fetchProductByName(trimmedQuery)

        // Only update if this is still the current search
        if (!abortControllerRef.current?.signal.aborted) {
          setSuggestions(results)
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Search error:", error)
          setSuggestions([])
        }
      } finally {
        if (!abortControllerRef.current?.signal.aborted) {
          setIsSearching(false)
        }
      }
    }, 150, 'search'), // Reduced to 150ms for ultra-fast response
    [fetchProductByBarcode, fetchProductByName]
  )

  const clearSearch = useCallback(() => {
    setSuggestions([])
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsSearching(false)
  }, [])

  // Cleanup function with cache management
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Aggressive cache cleanup for memory management
    const now = Date.now()
    for (const [key, value] of searchCacheRef.current.entries()) {
      if (now - value.timestamp > 300000) { // 5 minutes
        searchCacheRef.current.delete(key)
      }
    }
  }, [])

  return {
    suggestions,
    isSearching,
    search: debouncedSearch,
    clearSearch,
    cleanup
  }
}
