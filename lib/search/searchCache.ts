const cache = new Map<string, any[]>()

export function getCachedResult(query: string) {
  return cache.get(query.toLowerCase())
}

export function setCachedResult(query: string, data: any[]) {
  cache.set(query.toLowerCase(), data)
}
