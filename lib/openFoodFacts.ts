// /**
//  * OpenFoodFacts resolver (collision-safe)
//  *
//  * Strategy:
//  * 1. Try India database first (in.openfoodfacts.org)
//  * 2. Fallback to Global database (world.openfoodfacts.org)
//  * 3. Return first valid product found
//  *
//  * This avoids IN vs GLOBAL collision issues.
//  */

// export type OFFProductResult = {
//   productName: string | null
//   brand: string | null
//   ingredients: string | null
//   source: "IN" | "GLOBAL"
// }

// /**
//  * Fetch product details from OpenFoodFacts using barcode
//  */
// export async function fetchFromOFF(
//   barcode: string,
// ): Promise<OFFProductResult | null> {
//   if (!barcode) return null

//   const endpoints = [
//     {
//       url: "https://in.openfoodfacts.org/api/v0/product/",
//       source: "IN" as const,
//     },
//     {
//       url: "https://world.openfoodfacts.org/api/v0/product/",
//       source: "GLOBAL" as const,
//     },
//   ]

//   for (const endpoint of endpoints) {
//     try {
//       const response = await fetch(`${endpoint.url}${barcode}.json`, {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//         },
//         cache: "no-store", // always fresh
//       })

//       if (!response.ok) continue

//       const data = await response.json()

//       // OpenFoodFacts success = status === 1
//       if (data?.status === 1 && data?.product) {
//         return {
//           productName: data.product.product_name || null,
//           brand: data.product.brands || null,
//           ingredients: data.product.ingredients_text || null,
//           source: endpoint.source,
//         }
//       }
//     } catch (error) {
//       // Silent fail → try next endpoint
//       continue
//     }
//   }

//   // Not found in any OFF database
//   return null
// }


// lib/openFoodFacts.ts

export interface OFFProduct {
  product_name?: string
  brands?: string
  image_url?: string
  image_thumb_url?: string
  nutriments?: any
  ingredients_text?: string
  code?: string
  source: "IN" | "GLOBAL"
  nutrition_grades_tags?: string[]
  [key: string]: any
}

const BASES = [
  { url: "https://in.openfoodfacts.org/api/v0/product/", source: "IN" as const },
  { url: "https://world.openfoodfacts.org/api/v0/product/", source: "GLOBAL" as const },
]

export async function fetchFromOFF(barcode: string): Promise<OFFProduct | null> {
  for (const base of BASES) {
    try {
      const res = await fetch(`${base.url}${barcode}.json`, {
        headers: {
          "User-Agent": "FoodSnap/1.0",
        },
      })

      if (!res.ok) continue

      const data = await res.json()

      if (data.status === 1 && data.product) {
        return {
          ...data.product,
          source: base.source,
        }
      }
    } catch (error) {
      console.error(`Error fetching from ${base.source}:`, error)
      continue
    }
  }
  return null
}

export async function searchOFF(query: string, country: "IN" | "GLOBAL"): Promise<OFFProduct[]> {
  const base =
    country === "IN"
      ? "https://in.openfoodfacts.org/cgi/search.pl"
      : "https://world.openfoodfacts.org/cgi/search.pl"

  const url = `${base}?search_terms=${encodeURIComponent(
    query,
  )}&search_simple=1&action=process&json=1&page_size=20&sort_by=unique_scans_n`

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "FoodSnap/1.0",
      },
    })

    if (!res.ok) {
      return []
    }

    const data = await res.json()

    return (data.products || []).map((p: any) => ({
      ...p,
      source: country,
    }))
  } catch (error) {
    console.error(`Error searching ${country} database:`, error)
    return []
  }
}