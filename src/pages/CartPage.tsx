import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loadProducts } from '../store/slices/productsSlice'
import {
  removeFromCart,
  setCartQuantity,
  clearInventoryError,
} from '../store/slices/cartSlice'
import { selectCartLines, selectInventoryError } from '../store/slices/cartSlice'

export function CartPage() {
  const dispatch = useAppDispatch()
  const lines = useAppSelector(selectCartLines)
  const { items: products, status: productsStatus, error: productsError } =
    useAppSelector((s) => s.products)
  const inventoryErr = useAppSelector(selectInventoryError)

  useEffect(() => {
    dispatch(loadProducts())
  }, [dispatch])

  const rows = useMemo(() => {
    return lines
      .map((line) => {
        const product = products.find((p) => p.id === line.productId)
        if (!product) return null
        return { line, product }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
  }, [lines, products])

  const total = useMemo(
    () =>
      rows.reduce((sum, { line, product }) => sum + line.quantity * product.price, 0),
    [rows],
  )

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    })
      .format(n)
      .replace('₹', 'Rs ')

  if (productsStatus === 'loading' || productsStatus === 'idle') {
    return (
      <div className="cart-page">
        <h1 className="cart-page__title">Shopping Cart</h1>
        <div className="cart-skeleton" aria-hidden>
          <div className="cart-skeleton__row" />
          <div className="cart-skeleton__row" />
          <div className="cart-skeleton__row cart-skeleton__row--short" />
        </div>
      </div>
    )
  }

  if (productsStatus === 'failed') {
    return (
      <div className="cart-page">
        <h1 className="cart-page__title">Shopping Cart</h1>
        <p className="catalog__status catalog__status--error" role="alert">
          {productsError}
        </p>
        <Link to="/" className="link">
          Back to products
        </Link>
      </div>
    )
  }

  if (lines.length === 0 || rows.length === 0) {
    return (
      <div className="cart-page cart-page--empty">
        <h1 className="cart-page__title">Shopping Cart</h1>
        <div className="cart-empty">
          <div className="cart-empty__illus" aria-hidden>
            <span className="cart-empty__bag" />
          </div>
          <p className="cart-empty__title">Your bag is waiting</p>
          <p className="cart-empty__text">
            Add a few tees — we’ll keep them safe until checkout.
          </p>
          <Link to="/" className="btn btn--primary cart-empty__cta">
            Browse the collection
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <p className="cart-page__eyebrow">Almost there</p>
      <h1 className="cart-page__title">Shopping Cart</h1>

      <ul className="cart-list">
        {rows.map(({ line, product }) => {
          const max = product.quantity
          const options = Array.from({ length: max }, (_, i) => i + 1)

          return (
            <li key={product.id} className="cart-row">
              <div className="cart-row__image-wrap">
                <img
                  src={product.imageURL}
                  alt=""
                  className="cart-row__image"
                  width={96}
                  height={96}
                />
              </div>
              <div className="cart-row__details">
                <div className="cart-row__name">{product.name}</div>
                <div className="cart-row__price">{fmt(product.price)}</div>
              </div>
              <div className="cart-row__qty">
                <label className="cart-row__qty-label">
                  Qty:
                  <select
                    className="cart-row__select"
                    value={line.quantity}
                    onChange={(e) => {
                      dispatch(clearInventoryError())
                      dispatch(
                        setCartQuantity({
                          productId: product.id,
                          quantity: Number(e.target.value),
                          maxStock: max,
                        }),
                      )
                    }}
                  >
                    {options.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button
                type="button"
                className="btn btn--ghost cart-row__delete"
                onClick={() => dispatch(removeFromCart(product.id))}
              >
                Delete
              </button>
              {inventoryErr?.productId === product.id && (
                <p className="cart-row__error" role="alert">
                  {inventoryErr.message}
                </p>
              )}
            </li>
          )
        })}
      </ul>

      <div className="cart-page__total">
        <span className="cart-page__total-label">Total amount</span>
        <span className="cart-page__total-value">{fmt(total)}</span>
      </div>
    </div>
  )
}
