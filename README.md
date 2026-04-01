# Store — T-shirt e-commerce (React + Redux)

A client-side t-shirt catalog and shopping cart built with **React**, **Redux Toolkit**, and **React Router**. Products are loaded from a public JSON API with a local fallback; cart state persists in the browser.

## Tech stack

| Area | Choice |
|------|--------|
| UI | React 19, TypeScript |
| Build | Vite 8 |
| State | Redux Toolkit (`products` + `cart` slices) |
| Routing | React Router (`/` catalog, `/cart` cart) |
| Icons | `@mui/icons-material` (icons only; buttons and form controls use custom CSS) |
| Styling | Custom CSS (`App.css`), single font: **DM Sans** |

## Features

- **Product listing** — Cards with image, name, price, and metadata chips (type, colour, gender).
- **Search** — Free-text search across name, colour, and type; submit via the search button or **Enter**; placeholder: “Search for products…”.
- **Filters** — Colour, gender, price bands, and type (checkboxes). On small screens, filters open from a slide-over panel.
- **Shopping cart** — Add items, adjust quantity (stepper on cards; quantity select on cart page), remove lines, live **total** in INR-style formatting.
- **Stock limits** — Adding or increasing quantity beyond available stock shows an error message.
- **Cart persistence** — Cart lines are saved in `localStorage` and survive refresh and navigation. Search/filter UI state is **not** persisted (resets when you change route or reload).
- **Infinite loading** — First **15** products after filtering; scrolling near the bottom loads the next **15** (with a short loading indicator).
- **Data** — `GET` [my-json-server typicode demo products](https://my-json-server.typicode.com/Gulzeesh/demo/products); if the request fails, a small built-in fallback list is used.

## Prerequisites

- **Node.js** 18+ (recommended)  
- **npm** (comes with Node)

## Getting started

Clone or open the project folder, then:

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Type-check and produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally for smoke testing |

## Project structure (overview)

```
src/
  api/products.ts       # Fetch products + fallback data
  components/           # Header, SearchBar, filters, ProductCard, skeletons, …
  pages/                # ProductListPage, CartPage
  store/                # Redux store + slices + typed hooks
  types/product.ts      # Product shape
  utils/                # Filtering, colour accents for cards
  App.tsx               # Routes and layout
  App.css               # Global styles
  main.tsx              # Entry + Redux Provider
```

## Configuration notes

- **Product API URL** is defined in `src/api/products.ts`. Change `PRODUCTS_URL` if you point to another compatible JSON endpoint (array of product objects).
- **Cart storage key** is in `src/store/slices/cartSlice.ts` (`store-cart-v1`). Clear site data or remove that key in DevTools to reset the cart.

## Assignment / constraints (summary)

- Client-side search, filters, and cart logic (no backend for checkout).
- No Material UI / Bootstrap for primitive controls; MUI is used for icons only.
- Cart route: **`/cart`**.

## License

Private / assignment use unless you add your own license.
