export default function Filters({ filters, categories, onChange, onReset }) {
  return (
    <section className="filters panel" aria-label="Product filters">
      <label className="search-field">
        Search by title
        <input
          type="search"
          value={filters.query}
          onChange={(e) => onChange("query", e.target.value)}
          placeholder="e.g. backpack"
        />
      </label>
      <label>
        Category
        <select
          value={filters.category}
          onChange={(e) => onChange("category", e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label>
        Min price
        <input
          type="number"
          min="0"
          step="0.01"
          value={filters.minPrice}
          onChange={(e) => onChange("minPrice", e.target.value)}
          placeholder="0"
        />
      </label>
      <label>
        Max price
        <input
          type="number"
          min="0"
          step="0.01"
          value={filters.maxPrice}
          onChange={(e) => onChange("maxPrice", e.target.value)}
          placeholder="No limit"
        />
      </label>
      <button className="button button-light reset-button" onClick={onReset}>
        Clear filters
      </button>
    </section>
  );
}
