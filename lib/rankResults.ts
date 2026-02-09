// lib/rankResults.ts

interface RankableProduct {
  product_name?: string
  brands?: string
  image_url?: string
  image_thumb_url?: string
  nutriments?: any
  source: "IN" | "GLOBAL"
  [key: string]: any
}

interface RankedProduct extends RankableProduct {
  _score: number
}

export function rankResults(query: string, products: RankableProduct[]): RankedProduct[] {
  const q = query.toLowerCase().trim()

  const scored = products
    .filter((p) => p.product_name && p.product_name.trim().length > 0)
    .map((p) => {
      let score = 0
      const name = p.product_name?.toLowerCase() || ""
      const brands = p.brands?.toLowerCase() || ""

      if (name === q) score += 20
      if (brands === q) score += 15
      if (name.includes(q)) score += 10
      if (brands.includes(q)) score += 8
      if (name.startsWith(q)) score += 5
      if (brands.startsWith(q)) score += 4
      if (p.image_url || p.image_thumb_url) score += 2
      if (p.nutriments && Object.keys(p.nutriments).length > 0) score += 2
      if (p.ingredients_text) score += 1
      if (p.source === "IN") score += 3
      if (p.nutrition_grades_tags && p.nutrition_grades_tags.length > 0) score += 1

      return { ...p, _score: score }
    })

  const deduped = new Map<string, RankedProduct>()

  scored.forEach((product) => {
    const key = product.code || product.product_name?.toLowerCase().trim()
    if (!key) return

    const existing = deduped.get(key)
    if (!existing || product._score > existing._score) {
      deduped.set(key, product)
    }
  })

  return Array.from(deduped.values())
    .sort((a, b) => b._score - a._score)
    .slice(0, 10)
}