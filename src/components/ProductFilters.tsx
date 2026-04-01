import FilterListIcon from '@mui/icons-material/FilterList'
import type { PriceRangeId } from '../utils/filterProducts'

const COLOURS = ['Red', 'Blue', 'Green'] as const
const GENDERS = ['Men', 'Women'] as const
const PRICES: { id: PriceRangeId; label: string }[] = [
  { id: '0-250', label: '0-Rs250' },
  { id: '251-450', label: 'Rs251-450' },
  { id: '451+', label: 'Rs 450+' },
]
const TYPES = ['Polo', 'Hoodie', 'Basic'] as const

export type FilterState = {
  colours: string[]
  genders: string[]
  priceRanges: PriceRangeId[]
  types: string[]
}

type Props = {
  value: FilterState
  onChange: (next: FilterState) => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]
}

export function ProductFilters({ value, onChange, mobileOpen, onCloseMobile }: Props) {
  const patch = (partial: Partial<FilterState>) =>
    onChange({ ...value, ...partial })

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="filters__backdrop"
          aria-label="Close filters"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`filters ${mobileOpen ? 'filters--open' : ''}`}
        aria-label="Product filters"
      >
        <div className="filters__mobile-head">
          <span className="filters__title">Filters</span>
          <button
            type="button"
            className="filters__close"
            onClick={onCloseMobile}
            aria-label="Close filters"
          >
            ×
          </button>
        </div>

        <fieldset className="filters__group">
          <legend className="filters__legend">Colour</legend>
          {COLOURS.map((c) => (
            <label key={c} className="filters__row">
              <input
                type="checkbox"
                checked={value.colours.includes(c)}
                onChange={() => patch({ colours: toggle(value.colours, c) })}
              />
              <span>{c}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="filters__group">
          <legend className="filters__legend">Gender</legend>
          {GENDERS.map((g) => (
            <label key={g} className="filters__row">
              <input
                type="checkbox"
                checked={value.genders.includes(g)}
                onChange={() => patch({ genders: toggle(value.genders, g) })}
              />
              <span>{g}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="filters__group">
          <legend className="filters__legend">Price</legend>
          {PRICES.map(({ id, label }) => (
            <label key={id} className="filters__row">
              <input
                type="checkbox"
                checked={value.priceRanges.includes(id)}
                onChange={() =>
                  patch({ priceRanges: toggle(value.priceRanges, id) })
                }
              />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="filters__group">
          <legend className="filters__legend">Type</legend>
          {TYPES.map((t) => (
            <label key={t} className="filters__row">
              <input
                type="checkbox"
                checked={value.types.includes(t)}
                onChange={() => patch({ types: toggle(value.types, t) })}
              />
              <span>{t}</span>
            </label>
          ))}
        </fieldset>
      </aside>
    </>
  )
}

export function FilterToggleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="filter-toggle"
      onClick={onClick}
      aria-label="Open filters"
    >
      <FilterListIcon />
    </button>
  )
}
