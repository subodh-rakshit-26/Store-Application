import type { Product } from '../types/product'

const PRODUCTS_URL =
  'https://my-json-server.typicode.com/Gulzeesh/demo/products'

/** Minimal fallback if the API is unreachable */
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    imageURL: 'https://placehold.co/400x400',
    name: 'Black Polo',
    type: 'Polo',
    price: 250,
    currency: 'INR',
    color: 'Black',
    gender: 'Men',
    quantity: 3,
  },
  {
    id: 2,
    imageURL: 'https://placehold.co/400x400',
    name: 'Blue Polo',
    type: 'Polo',
    price: 350,
    currency: 'INR',
    color: 'Blue',
    gender: 'Women',
    quantity: 3,
  },
  {
    id: 3,
    imageURL: 'https://placehold.co/400x400',
    name: 'Pink Polo',
    type: 'Polo',
    price: 350,
    currency: 'INR',
    color: 'Pink',
    gender: 'Women',
    quantity: 6,
  },
]

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(PRODUCTS_URL)
  if (!res.ok) {
    return FALLBACK_PRODUCTS
  }
  const data = (await res.json()) as Product[]
  return Array.isArray(data) && data.length > 0 ? data : FALLBACK_PRODUCTS
}
