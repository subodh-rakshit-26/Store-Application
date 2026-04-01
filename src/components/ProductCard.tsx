import type { CSSProperties } from 'react'
import type { Product } from '../types/product'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  addToCart,
  clearInventoryError,
  setCartQuantity,
} from '../store/slices/cartSlice'
import {
  selectInventoryError,
  selectQuantityForProduct,
} from '../store/slices/cartSlice'
import { accentForColor } from '../utils/colorAccent'

type Props = {
  product: Product
}

export function ProductCard({ product }: Props) {
  const dispatch = useAppDispatch()
  const inCart = useAppSelector(selectQuantityForProduct(product.id))
  const inventoryErr = useAppSelector(selectInventoryError)

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: product.currency || 'INR',
      maximumFractionDigits: 0,
    })
      .format(n)
      .replace('₹', 'Rs ')

  const onAdd = () => {
    dispatch(clearInventoryError())
    if (product.quantity <= 0) {
      return
    }
    dispatch(
      addToCart({
        productId: product.id,
        amount: 1,
        maxStock: product.quantity,
      }),
    )
  }

  const changeQty = (delta: number) => {
    dispatch(clearInventoryError())
    const next = inCart + delta
    if (next < 0) return
    dispatch(
      setCartQuantity({
        productId: product.id,
        quantity: next,
        maxStock: product.quantity,
      }),
    )
  }

  const outOfStock = product.quantity <= 0
  const accent = accentForColor(product.color)

  return (
    <article
      className={`product-card ${inCart > 0 ? 'product-card--in-cart' : ''}`}
      style={{ '--card-accent': accent } as CSSProperties}
    >
      <div className="product-card__meta">
        <span className="product-card__chip">{product.type}</span>
        <span className="product-card__chip product-card__chip--soft">
          {product.color}
        </span>
        <span className="product-card__chip product-card__chip--outline">
          {product.gender}
        </span>
      </div>
      <h2 className="product-card__title">{product.name}</h2>
      <div className="product-card__image-wrap">
        <img
          src={product.imageURL}
          alt=""
          className="product-card__image"
          loading="lazy"
          width={400}
          height={400}
        />
        {inCart > 0 && (
          <span className="product-card__badge-in-cart" aria-hidden>
            In bag
          </span>
        )}
      </div>
      <div className="product-card__footer">
        <span className="product-card__price">{fmt(product.price)}</span>
        {inCart > 0 ? (
          <div className="qty-stepper" role="group" aria-label="Quantity in cart">
            <button
              type="button"
              className="qty-stepper__btn"
              onClick={() => changeQty(-1)}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="qty-stepper__value">{inCart}</span>
            <button
              type="button"
              className="qty-stepper__btn"
              onClick={() => changeQty(1)}
              disabled={inCart >= product.quantity}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn--primary product-card__add"
            onClick={onAdd}
            disabled={outOfStock}
          >
            {outOfStock ? 'Out of stock' : 'Add to cart'}
          </button>
        )}
      </div>
      {inventoryErr?.productId === product.id && (
        <p className="product-card__error" role="alert">
          {inventoryErr.message}
        </p>
      )}
    </article>
  )
}
