export default function Cart({ items, onQuantity, onRemove, onClear }) {
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return (
    <aside className="cart panel">
      <div className="section-heading">
        <h2>Shopping Cart</h2>
        <span className="count-badge">
          {items.reduce((n, x) => n + x.quantity, 0).toLocaleString("en-US")}
        </span>
      </div>
      {!items.length ? (
        <p className="muted">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt="" />
                <div className="cart-item-info">
                  <strong>{item.title}</strong>
                  <span>
                    {(item.price * item.quantity).toLocaleString("en-US")} USD
                  </span>
                  <div className="quantity-control">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => onQuantity(item.id, -1)}
                    >
                      −
                    </button>
                    <span>{item.quantity.toLocaleString("en-US")}</span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => onQuantity(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="remove-button"
                  aria-label="Remove item"
                  onClick={() => onRemove(item.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <span>Total</span>
            <strong>
              {total.toLocaleString("en-US", { maximumFractionDigits: 2 })} USD
            </strong>
          </div>
          <button className="button button-danger clear-cart" onClick={onClear}>
            Clear cart
          </button>
        </>
      )}
    </aside>
  );
}
