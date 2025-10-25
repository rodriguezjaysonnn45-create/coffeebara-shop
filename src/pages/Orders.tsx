import React, { useEffect, useState } from "react";
import { apiUrl } from "../utils/api";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const user = JSON.parse(localStorage.getItem("coffeebaraUser") || "{}");

  useEffect(() => {
    if (!user.email) return;
    fetch(apiUrl(`/api/orders/${user.email}`))
      .then(res => res.json())
      .then(setOrders);
  }, [user.email]);

  // DELETE
  const deleteOrder = async (id: number) => {
    if (!confirm("Remove this order?")) return;
    await fetch(apiUrl(`/api/orders/${id}`), { method: "DELETE" });
    setOrders(orders.filter(o => o.id !== id));
  };

  // SAVE EDIT
  const saveEdit = async () => {
    if (!editingOrder) return;
    await fetch(apiUrl(`/api/orders/${editingOrder.id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingOrder),
    });
    setOrders(orders.map(o => (o.id === editingOrder.id ? editingOrder : o)));
    setEditingOrder(null);
  };

  // CHECKOUT
  const totalPrice = orders.reduce((sum, o) => sum + parseFloat(o.total_price), 0);
  const checkout = () => setReceiptVisible(true);

  return (
    <section className="orders-container">
      <h2>Your Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <>
          <div className="orders-list">
            {orders.map(order => (
              <div className="order-card" key={order.id}>
                <img className="order-image" src={order.item_image} alt={order.item_name} />

                <h3>{order.item_name}</h3>
                <p>Size: {order.size}</p>
                <p>Milk: {order.milk_type}</p>
                <p>Qty: {order.quantity}</p>
                {order.special_instructions && <i>"{order.special_instructions}"</i>}
                <p className="price">₱{order.total_price}</p>

                <div className="order-actions">
                  <button className="edit-btn" onClick={() => setEditingOrder(order)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteOrder(order.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-bar">
            <p>Total: <strong>₱{totalPrice.toFixed(2)}</strong></p>
            <button className="checkout-btn" onClick={checkout}>Checkout</button>
          </div>
        </>
      )}

      {/* EDIT POPUP */}
      {editingOrder && (
        <div className="edit-modal">
          <div className="edit-box">
            <h3>Edit Order</h3>

            <label>Size:</label>
            <input value={editingOrder.size} onChange={e => setEditingOrder({ ...editingOrder, size: e.target.value })} />

            <label>Milk Type:</label>
            <input value={editingOrder.milk_type} onChange={e => setEditingOrder({ ...editingOrder, milk_type: e.target.value })} />

            <label>Quantity:</label>
            <input type="number" value={editingOrder.quantity} onChange={e => setEditingOrder({ ...editingOrder, quantity: e.target.value })} />

            <label>Special Instructions:</label>
            <textarea value={editingOrder.special_instructions} onChange={e => setEditingOrder({ ...editingOrder, special_instructions: e.target.value })} />

            <div className="edit-buttons">
              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setEditingOrder(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {receiptVisible && (
        <div className="receipt-modal">
          <div className="receipt-box">
            <h3>Receipt</h3>
            {orders.map(o => (
              <p key={o.id}>{o.quantity}x {o.item_name} — ₱{o.total_price}</p>
            ))}
            <hr />
            <p><strong>Total: ₱{totalPrice.toFixed(2)}</strong></p>
            <button onClick={() => setReceiptVisible(false)}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Orders;
