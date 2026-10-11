import ProductList from "./ProductList.jsx";

export default function Recommendations({
  selected,
  products,
  onSelect,
  onAdd,
}) {
  if (!selected) return null;
  return (
    <section className="recommendations">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Selected: {selected.title}</p>
          <h2>Related products</h2>
        </div>
        <button className="button button-light" onClick={() => onSelect(null)}>
          Close recommendations
        </button>
      </div>
      <ProductList
        products={products}
        onSelect={onSelect}
        onAdd={onAdd}
        selectedId={selected.id}
      />
    </section>
  );
}
