export default function ProductCard({
  product,
  onSelect,
  onAdd,
  selected = false,
}) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>
      <span className="category-tag">{product.category}</span>
      <h3>{product.title}</h3>
      <div className="product-meta">
        <strong>{Number(product.price).toLocaleString("en-US")} USD</strong>
        <span className="rating">
          ★ {product.rating?.rate ?? "—"}{" "}
          <small>({product.rating?.count ?? 0})</small>
        </span>
      </div>
      <div className="card-actions">
        <button
          className="button button-light"
          onClick={() => onSelect(product)}
          aria-pressed={selected}
        >
          Related products
        </button>
        <button
          className="button button-primary"
          onClick={() => onAdd(product)}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
