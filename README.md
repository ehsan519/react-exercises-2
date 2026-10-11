# Product Recommendation Store

A responsive product catalog built with React and Vite. Browse products, filter by name, category, and price, view related recommendations, and manage a shopping cart. Product data, cart contents, and filters are cached in the browser using `localStorage`.

## Requirements

- Node.js and npm

## Getting started

```bash
npm install
npm run dev
```

Create a production build with `npm run build` and preview it with `npm run preview`.

## Features

- Fetches products from the Fake Store API and caches them in `localStorage` under the `products` key.
- Debounced product-title search, category selection, and price range filtering.
- Related-product recommendations, ratings, and shopping cart management.
- Restores cart and filters after reload; handles invalid cached JSON without crashing.
- Responsive English-language interface. Previously cached products remain available if the API request fails.

## Project structure

`src/App.jsx` coordinates the application. Product cards, product list, filters, cart, and recommendations are implemented in separate components. `useDebounce.js` provides the search delay.

## Deployment

**Vercel:** Import the repository and use `npm run build` as the build command. The output directory is `dist`.

**GitHub Pages:** Configure the Vite `base` option to match the repository path (add `vite.config.js` if needed), then publish the build using GitHub Actions. Use `/` for a root domain and typically `/<repository>/` for a project repository. This application does not use client-side routing.
