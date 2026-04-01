export function CatalogSkeleton() {
  return (
    <div className="skeleton-grid" aria-hidden>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-card__shimmer skeleton-card__title" />
          <div className="skeleton-card__shimmer skeleton-card__image" />
          <div className="skeleton-card__row">
            <div className="skeleton-card__shimmer skeleton-card__price" />
            <div className="skeleton-card__shimmer skeleton-card__btn" />
          </div>
        </div>
      ))}
    </div>
  )
}
