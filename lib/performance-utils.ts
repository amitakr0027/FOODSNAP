// Performance optimization utilities
export class PerformanceOptimizer {
  private static cache = new Map<string, any>()
  private static debounceTimers = new Map<string, NodeJS.Timeout>()

  // Optimized debounce with cleanup
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number,
    key: string
  ): (...args: Parameters<T>) => void {
    return (...args: Parameters<T>) => {
      const existingTimer = this.debounceTimers.get(key)
      if (existingTimer) {
        clearTimeout(existingTimer)
      }

      const timer = setTimeout(() => {
        func(...args)
        this.debounceTimers.delete(key)
      }, delay)

      this.debounceTimers.set(key, timer)
    }
  }

  // Memory-efficient cache with TTL
  static memoize<T>(
    func: (...args: any[]) => T,
    keyGenerator: (...args: any[]) => string,
    ttl: number = 300000 // 5 minutes default
  ): (...args: any[]) => T {
    return (...args: any[]): T => {
      const key = keyGenerator(...args)
      const cached = this.cache.get(key)
      
      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.value
      }

      const result = func(...args)
      this.cache.set(key, { value: result, timestamp: Date.now() })
      
      // Cleanup old entries periodically
      if (this.cache.size > 100) {
        this.cleanupCache(ttl)
      }
      
      return result
    }
  }

  // Efficient cache cleanup
  private static cleanupCache(ttl: number) {
    const now = Date.now()
    const keysToDelete: string[] = []
    
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > ttl) {
        keysToDelete.push(key)
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key))
  }

  // Optimized localStorage operations
  static setStorageItem(key: string, value: any): void {
    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
    } catch (error) {
      console.warn(`Failed to save to localStorage: ${key}`, error)
    }
  }

  static getStorageItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Failed to read from localStorage: ${key}`, error)
      return defaultValue
    }
  }

  // Batch DOM updates
  static batchDOMUpdates(updates: (() => void)[]): void {
    requestAnimationFrame(() => {
      updates.forEach(update => update())
    })
  }

  // Cleanup function for component unmount
  static cleanup(): void {
    this.debounceTimers.forEach(timer => clearTimeout(timer))
    this.debounceTimers.clear()
  }
}

// Virtual scrolling utility for large lists
export class VirtualScrollManager {
  private itemHeight: number
  private containerHeight: number
  private scrollTop: number = 0
  private totalItems: number

  constructor(itemHeight: number, containerHeight: number, totalItems: number) {
    this.itemHeight = itemHeight
    this.containerHeight = containerHeight
    this.totalItems = totalItems
  }

  getVisibleRange(): { start: number; end: number; offsetY: number } {
    const start = Math.floor(this.scrollTop / this.itemHeight)
    const visibleCount = Math.ceil(this.containerHeight / this.itemHeight)
    const end = Math.min(start + visibleCount + 2, this.totalItems) // +2 for buffer
    const offsetY = start * this.itemHeight

    return { start, end, offsetY }
  }

  updateScrollTop(scrollTop: number): void {
    this.scrollTop = scrollTop
  }

  getTotalHeight(): number {
    return this.totalItems * this.itemHeight
  }
}
