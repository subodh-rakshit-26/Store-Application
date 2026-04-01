import type { Product } from '../types/product'

export type PriceRangeId = '0-250' | '251-450' | '451+'

export function matchesSearch(product: Product, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const hay = `${product.name} ${product.color} ${product.type}`.toLowerCase()
  const words = q.split(/\s+/).filter(Boolean)
  return words.every((w) => hay.includes(w))
}

function matchesPrice(product: Product, ranges: PriceRangeId[]): boolean {
  if (ranges.length === 0) return true
  const p = product.price
  return ranges.some((r) => {
    if (r === '0-250') return p >= 0 && p <= 250
    if (r === '251-450') return p >= 251 && p <= 450
    return p > 450
  })
}

export function filterCatalog(
  products: Product[],
  opts: {
    searchQuery: string
    colours: string[]
    genders: string[]
    priceRanges: PriceRangeId[]
    types: string[]
  },
): Product[] {
  return products.filter((product) => {
    if (!matchesSearch(product, opts.searchQuery)) return false

    if (opts.colours.length > 0) {
      const c = product.color.toLowerCase()
      if (!opts.colours.some((x) => x.toLowerCase() === c)) return false
    }

    if (opts.genders.length > 0) {
      const g = product.gender.toLowerCase()
      if (!opts.genders.some((x) => x.toLowerCase() === g)) return false
    }

    if (!matchesPrice(product, opts.priceRanges)) return false

    if (opts.types.length > 0) {
      const t = product.type.toLowerCase()
      if (!opts.types.some((x) => x.toLowerCase() === t)) return false
    }

    return true
  })
}
