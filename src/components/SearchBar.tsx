import { useState, type FormEvent } from 'react'
import SearchIcon from '@mui/icons-material/Search'

type Props = {
  onSearch: (query: string) => void
  initialQuery?: string
}

export function SearchBar({ onSearch, initialQuery = '' }: Props) {
  const [value, setValue] = useState(initialQuery)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearch(value.trim())
  }

  return (
    <form className="search-bar" onSubmit={onSubmit} role="search">
      <label htmlFor="product-search" className="visually-hidden">
        Search products
      </label>
      <input
        id="product-search"
        type="search"
        className="search-bar__input"
        placeholder="Search for products..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
      />
      <div className="search-button-container">
        <button type="submit" className="search-bar__btn" aria-label="Search">
          <SearchIcon className="search-bar__icon" />
        </button>
      </div>
    </form>
  )
}
