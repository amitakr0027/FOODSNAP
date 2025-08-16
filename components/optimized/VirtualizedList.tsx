import React, { useState, useEffect, useCallback, useMemo } from "react"
import { VirtualScrollManager } from "@/lib/performance-utils"

interface VirtualizedListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
}

export function VirtualizedList<T>({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem, 
  className 
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)

  const virtualScrollManager = useMemo(
    () => new VirtualScrollManager(itemHeight, containerHeight, items.length),
    [itemHeight, containerHeight, items.length]
  )

  const { start, end, offsetY } = useMemo(() => {
    virtualScrollManager.updateScrollTop(scrollTop)
    return virtualScrollManager.getVisibleRange()
  }, [virtualScrollManager, scrollTop])

  const visibleItems = useMemo(
    () => items.slice(start, end),
    [items, start, end]
  )

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  return (
    <div
      className={className}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: virtualScrollManager.getTotalHeight(), position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={start + index} style={{ height: itemHeight }}>
              {renderItem(item, start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
