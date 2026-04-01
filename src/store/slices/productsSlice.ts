import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchProducts } from '../../api/products'
import type { Product } from '../../types/product'

export const loadProducts = createAsyncThunk('products/load', async () => {
  return fetchProducts()
})

type ProductsState = {
  items: Product[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to load products'
      })
  },
})

export default productsSlice.reducer
