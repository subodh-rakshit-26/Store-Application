import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

const STORAGE_KEY = 'store-cart-v1'

export type CartLine = {
  productId: number
  quantity: number
}

type CartState = {
  lines: CartLine[]
  inventoryError: { productId: number; message: string } | null
}

function loadFromStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (x): x is CartLine =>
        typeof x === 'object' &&
        x !== null &&
        typeof (x as CartLine).productId === 'number' &&
        typeof (x as CartLine).quantity === 'number' &&
        (x as CartLine).quantity > 0,
    )
  } catch {
    return []
  }
}

function saveToStorage(lines: CartLine[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  } catch {
    /* ignore */
  }
}

const initialState: CartState = {
  lines: loadFromStorage(),
  inventoryError: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearInventoryError(state) {
      state.inventoryError = null
    },
    addToCart(
      state,
      action: PayloadAction<{
        productId: number
        amount: number
        maxStock: number
      }>,
    ) {
      const { productId, amount, maxStock } = action.payload
      const line = state.lines.find((l) => l.productId === productId)
      const current = line?.quantity ?? 0
      const next = current + amount
      if (next > maxStock) {
        state.inventoryError = {
          productId,
          message: `Only ${maxStock} item(s) available in stock for this product.`,
        }
        return
      }
      state.inventoryError = null
      if (line) {
        line.quantity = next
      } else {
        state.lines.push({ productId, quantity: amount })
      }
      saveToStorage(state.lines)
    },
    setCartQuantity(
      state,
      action: PayloadAction<{
        productId: number
        quantity: number
        maxStock: number
      }>,
    ) {
      const { productId, quantity, maxStock } = action.payload
      const q = Math.max(0, Math.floor(quantity))
      if (q > maxStock) {
        state.inventoryError = {
          productId,
          message: `Only ${maxStock} item(s) available in stock for this product.`,
        }
        return
      }
      state.inventoryError = null
      const line = state.lines.find((l) => l.productId === productId)
      if (q === 0) {
        state.lines = state.lines.filter((l) => l.productId !== productId)
      } else if (line) {
        line.quantity = q
      } else {
        state.lines.push({ productId, quantity: q })
      }
      saveToStorage(state.lines)
    },
    removeFromCart(state, action: PayloadAction<number>) {
      const id = action.payload
      state.lines = state.lines.filter((l) => l.productId !== id)
      saveToStorage(state.lines)
    },
  },
})

export const { addToCart, setCartQuantity, removeFromCart, clearInventoryError } =
  cartSlice.actions

// Selectors (kept next to slice for simpler dev ergonomics)
export const selectCartLines = (state: RootState) => state.cart.lines

export const selectCartItemCount = (state: RootState) =>
  state.cart.lines.reduce((sum, l) => sum + l.quantity, 0)

export const selectQuantityForProduct =
  (productId: number) => (state: RootState) =>
    state.cart.lines.find((l) => l.productId === productId)?.quantity ?? 0

export const selectInventoryError = (state: RootState) =>
  state.cart.inventoryError

export default cartSlice.reducer
