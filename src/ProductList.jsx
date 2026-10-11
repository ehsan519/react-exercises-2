import ProductCard from "./ProductCard.jsx";

export default function ProductList({ products, onSelect, onAdd, selectedId }) {
  if (!products.length)
    return <div className="empty-state">No products match your criteria.</div>;
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onSelect}
          onAdd={onAdd}
          selected={product.id === selectedId}
        />
      ))}
    </div>
  );
}
