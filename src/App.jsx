import React, { useCallback, useEffect, useMemo, useState } from "react";
import Filters from "./Filters.jsx";
import ProductList from "./ProductList.jsx";
import Cart from "./Cart.jsx";
import Recommendations from "./Recommendations.jsx";
import useDebounce from "./useDebounce.js";

const API = "https://fakestoreapi.com/products";
const DEFAULT_FILTERS = {
  query: "",
  category: "all",
  minPrice: "",
  maxPrice: "",
};
function readStorage(key, fallback, validate = () => true) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const value = JSON.parse(raw);
    return validate(value) ? value : fallback;
  } catch {
    return fallback;
  }
}
function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
const validProducts = (value) =>
  Array.isArray(value) &&
  value.every(
    (p) =>
      p &&
      Number.isFinite(Number(p.id)) &&
      typeof p.title === "string" &&
      Number.isFinite(Number(p.price)),
  );
const validCart = (value) =>
  Array.isArray(value) &&
  value.every(
    (x) =>
      x &&
      Number.isFinite(Number(x.id)) &&
      Number.isFinite(Number(x.price)) &&
      Number.isInteger(x.quantity) &&
      x.quantity > 0,
  );
const validFilters = (value) =>
  value &&
  typeof value === "object" &&
  typeof value.query === "string" &&
  typeof value.category === "string" &&
  (typeof value.minPrice === "string" || typeof value.minPrice === "number") &&
  (typeof value.maxPrice === "string" || typeof value.maxPrice === "number");

export default function App() {
  const [products, setProducts] = useState(() =>
    readStorage("products", [], validProducts),
  );
  const [cart, setCart] = useState(() => readStorage("cart", [], validCart));
  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    ...readStorage("filters", DEFAULT_FILTERS, validFilters),
  }));
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const debouncedQuery = useDebounce(filters.query, 500);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API);
      if (!response.ok)
        throw new Error(`Server responded with status ${response.status}.`);
      const data = await response.json();
      if (!validProducts(data))
        throw new Error("The received data is invalid.");
      setProducts(data);
      if (!saveStorage("products", data))
        setNotice("Products could not be saved in browser storage.");
    } catch (err) {
      setError(
        products.length
          ? `Could not refresh products; showing cached products. (${err.message})`
          : `Could not load products. Check your internet connection and try again. (${err.message})`,
      );
    } finally {
      setLoading(false);
    }
  }, [products.length]);

  useEffect(() => {
    loadProducts();
  }, []); // Initial load; the retry button calls this function as well.
  useEffect(() => {
    saveStorage("cart", cart);
  }, [cart]);
  useEffect(() => {
    saveStorage("filters", filters);
  }, [filters]);
  useEffect(() => {
    if (notice) {
      const t = setTimeout(() => setNotice(""), 4500);
      return () => clearTimeout(t);
    }
  }, [notice]);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(),
    [products],
  );
  const filtered = useMemo(() => {
    const query = debouncedQuery.trim().toLocaleLowerCase();
    const min = filters.minPrice === "" ? null : Number(filters.minPrice);
    const max = filters.maxPrice === "" ? null : Number(filters.maxPrice);
    const validRange =
      (min === null || (Number.isFinite(min) && min >= 0)) &&
      (max === null || (Number.isFinite(max) && max >= 0)) &&
      (min === null || max === null || min <= max);
    if (!validRange) return [];
    return products.filter(
      (p) =>
        (!query || p.title.toLocaleLowerCase().includes(query)) &&
        (filters.category === "all" || p.category === filters.category) &&
        (min === null || Number(p.price) >= min) &&
        (max === null || Number(p.price) <= max),
    );
  }, [products, debouncedQuery, filters]);
  const recommendations = useMemo(
    () =>
      selected
        ? products.filter(
            (p) => p.category === selected.category && p.id !== selected.id,
          )
        : [],
    [products, selected],
  );
  const rangeInvalid =
    filters.minPrice !== "" &&
    filters.maxPrice !== "" &&
    Number(filters.minPrice) > Number(filters.maxPrice);

  function changeFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }
  function addToCart(product) {
    setCart((current) => {
      const found = current.find((x) => x.id === product.id);
      return found
        ? current.map((x) =>
            x.id === product.id ? { ...x, quantity: x.quantity + 1 } : x,
          )
        : [
            ...current,
            {
              id: product.id,
              title: product.title,
              image: product.image,
              price: Number(product.price),
              quantity: 1,
            },
          ];
    });
  }
  function changeQuantity(id, amount) {
    setCart((current) =>
      current
        .map((x) => (x.id === id ? { ...x, quantity: x.quantity + amount } : x))
        .filter((x) => x.quantity > 0),
    );
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-inner">
          <span className="eyebrow">
            Product Recommendations · React + Vite
          </span>
          <h1>Find your next favorite</h1>
          <p>Search, compare, and choose from the store catalog</p>
        </div>
      </header>
      <main className="layout">
        <section className="catalog">
          <Filters
            filters={filters}
            categories={categories}
            onChange={changeFilter}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
          {rangeInvalid && (
            <p className="validation-message" role="alert">
              Minimum price cannot be greater than maximum price.
            </p>
          )}
          {error && (
            <div className="alert" role="alert">
              <span>{error}</span>
              <button
                className="button button-light"
                onClick={loadProducts}
                disabled={loading}
              >
                Retry
              </button>
            </div>
          )}
          {notice && (
            <div className="notice" role="status">
              {notice}
            </div>
          )}
          <div className="section-heading results-heading">
            <div>
              <h2>All Products</h2>
              <span className="muted">
                {filtered.length.toLocaleString("en-US")} products
              </span>
            </div>
            {loading && (
              <span className="loading-label">
                <i className="spinner" /> Loading products…
              </span>
            )}
          </div>
          {loading && !products.length ? (
            <div className="empty-state">Loading products…</div>
          ) : (
            <ProductList
              products={filtered}
              onSelect={setSelected}
              onAdd={addToCart}
              selectedId={selected?.id}
            />
          )}
          <Recommendations
            selected={selected}
            products={recommendations}
            onSelect={setSelected}
            onAdd={addToCart}
          />
        </section>
        <Cart
          items={cart}
          onQuantity={changeQuantity}
          onRemove={(id) => setCart((xs) => xs.filter((x) => x.id !== id))}
          onClear={() => setCart([])}
        />
      </main>
      <footer>Product Recommendation Store</footer>
    </div>
  );
}
