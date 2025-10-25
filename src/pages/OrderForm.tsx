import React, { useState, useEffect } from "react";
import "./OrderForm.css";

interface OrderFormProps {
  item: {
    name: string;
    price: number;
    image: string;
    category: string;
  };
  onClose: () => void;
  onConfirm: (order: any) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ item, onClose, onConfirm }) => {
  const [size, setSize] = useState("Medium");
  const [milkType, setMilkType] = useState("Whole");
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [total, setTotal] = useState(item.price);

  const sizePrices: Record<string, number> = {
    Medium: item.price,
    Large: item.price + 20,
    Grande: item.price + 40,
  };

  useEffect(() => {
    setTotal(sizePrices[size] * quantity);
  }, [size, quantity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      item_name: item.name,
      item_image: item.image,
      size,
      milk_type: item.category === "drinks" ? milkType : null,
      quantity,
      special_instructions: specialInstructions,
      total_price: total,
    });
  };

  return (
    <div className="order-form-overlay">
      <div className="order-form-container">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <h2>Order: <span>{item.name}</span></h2>
        <img src={item.image} alt={item.name} className="order-form-image" />

        <form onSubmit={handleSubmit}>
          {item.category === "drinks" && (
            <>
              <div className="form-group">
                <label>Size:</label>
                <select value={size} onChange={(e) => setSize(e.target.value)}>
                  <option value="Medium">Medium (₱{item.price})</option>
                  <option value="Large">Large (₱{item.price + 20})</option>
                  <option value="Grande">Grande (₱{item.price + 40})</option>
                </select>
              </div>

              <div className="form-group">
                <label>Milk Type:</label>
                <select
                  value={milkType}
                  onChange={(e) => setMilkType(e.target.value)}
                >
                  <option value="Whole">Whole</option>
                  <option value="Non-fat">Non-fat</option>
                  <option value="Soy Milk">Soy Milk</option>
                  <option value="Oat Milk">Oat Milk</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Special Instructions:</label>
            <textarea
              placeholder="Any custom requests?"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>

          <div className="total-display">
            <strong>Total:</strong> ₱{total}
          </div>

          <div className="button-group">
            <button type="submit" className="confirm-btn">Confirm Order</button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
