import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loadProducts } from '../store/slices/productsSlice'
import { filterCatalog } from '../utils/filterProducts'
import type { FilterState } from '../components/ProductFilters'
import {
  ProductFilters,
  FilterToggleButton,
} from '../components/ProductFilters'
import { SearchBar } from '../components/SearchBar'
import { ProductCard } from '../components/ProductCard'
import { CatalogSkeleton } from '../components/CatalogSkeleton'

const PAGE_SIZE = 15
const LOAD_MORE_MS = 450

const defaultFilters: FilterState = {
  colours: [],
  genders: [],
  priceRanges: [],
  types: [],
}

export function ProductListPage() {
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((s) => s.products)

  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const sentinelRef = useRef<HTMLDivElement>(null)
  const loadingMoreRef = useRef(false)
  const displayCountRef = useRef(PAGE_SIZE)
  const visibleLenRef = useRef(0)
  const loadMoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    dispatch(loadProducts())
  }, [dispatch])

  const filterKey = useMemo(() => JSON.stringify(filters), [filters])

  const visible = useMemo(
    () =>
      filterCatalog(items, {
        searchQuery,
        colours: filters.colours,
        genders: filters.genders,
        priceRanges: filters.priceRanges,
        types: filters.types,
      }),
    [items, searchQuery, filters],
  )

  visibleLenRef.current = visible.length
  displayCountRef.current = displayCount

  useEffect(() => {
    if (loadMoreTimerRef.current) {
      clearTimeout(loadMoreTimerRef.current)
      loadMoreTimerRef.current = null
    }
    loadingMoreRef.current = false
    setIsLoadingMore(false)
    const first = Math.min(PAGE_SIZE, visible.length)
    setDisplayCount(first)
    displayCountRef.current = first
  }, [items, searchQuery, filterKey, visible.length])

  const visibleSlice = useMemo(
    () => visible.slice(0, displayCount),
    [visible, displayCount],
  )

  const hasMore = displayCount < visible.length

  const loadMore = useCallback(() => {
    if (loadingMoreRef.current) return
    if (displayCountRef.current >= visibleLenRef.current) return
    loadingMoreRef.current = true
    setIsLoadingMore(true)
    if (loadMoreTimerRef.current) clearTimeout(loadMoreTimerRef.current)
    loadMoreTimerRef.current = window.setTimeout(() => {
      loadMoreTimerRef.current = null
      setDisplayCount((prev) =>
        Math.min(prev + PAGE_SIZE, visibleLenRef.current),
      )
      setIsLoadingMore(false)
      loadingMoreRef.current = false
    }, LOAD_MORE_MS)
  }, [])

  useEffect(() => {
    return () => {
      if (loadMoreTimerRef.current) clearTimeout(loadMoreTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (status !== 'succeeded' || !hasMore) return
    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry?.isIntersecting) return
        loadMore()
      },
      { root: null, rootMargin: '240px', threshold: 0 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [status, hasMore, loadMore, displayCount])

  return (
    <div className="catalog">
      <section className="catalog-hero" aria-labelledby="catalog-hero-title">
        <p className="catalog-hero__eyebrow">Curated cotton · Limited runs</p>
        <h1 id="catalog-hero-title" className="catalog-hero__title">
          Find a tee that feels like{' '}
          <span className="catalog-hero__accent">yours</span>
        </h1>
        <p className="catalog-hero__sub">
          Search by vibe, colour, or cut — then drop it in your bag.
        </p>
      </section>

      <div className="catalog__toolbar">
        <SearchBar onSearch={setSearchQuery} />
        <div className="catalog__toolbar-actions">
          <FilterToggleButton onClick={() => setFiltersOpen(true)} />
        </div>
      </div>

      <div className="catalog__layout">
        <ProductFilters
          value={filters}
          onChange={setFilters}
          mobileOpen={filtersOpen}
          onCloseMobile={() => setFiltersOpen(false)}
        />

        <main className="catalog__main">
          {(status === 'idle' || status === 'loading') && <CatalogSkeleton />}
          {status === 'failed' && (
            <p className="catalog__status catalog__status--error" role="alert">
              {error}
            </p>
          )}
          {status === 'succeeded' && visible.length === 0 && (
            <div className="catalog-empty-state">
              <div className="catalog-empty-state__icon" aria-hidden>
                <span />
                <span />
                <span />
              </div>
              <h2 className="catalog-empty-state__title">Nothing here yet</h2>
              <p className="catalog-empty-state__text">
                Try loosening filters or search for something broader — like
                “polo” or “blue”.
              </p>
            </div>
          )}
          {status === 'succeeded' && visible.length > 0 && (
            <>
              <div className="product-grid">
                {visibleSlice.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {isLoadingMore && hasMore && (
                <div className="catalog__load-more" role="status" aria-live="polite">
                  <span className="catalog__spinner" aria-hidden />
                  <span className="catalog__load-more-text">Loading more…</span>
                </div>
              )}
              {hasMore && (
                <div
                  ref={sentinelRef}
                  className="catalog__infinite-sentinel"
                  aria-hidden
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
