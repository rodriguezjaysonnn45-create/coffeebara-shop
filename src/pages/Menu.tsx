import { useState } from "react";
import { apiUrl } from "../utils/api";
import "../styles/Menu.css";

interface MenuItem {
  name: string;
  description: string;
  price: number;
  category: "hot" | "cold" | "snacks";
  image: string;
}

const Menu = () => {
  const [filter, setFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [size, setSize] = useState("medium");
  const [milkType, setMilkType] = useState("Whole");
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [showModal, setShowModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("coffeebaraUser") || "null");

  const menuItems: MenuItem[] = [
    // 🔥 Hot Drinks
    { name: "Capybrew Espresso", description: "Bold, rich, and full-bodied single-origin espresso.", price: 150, category: "hot", image: "/images/capybrew-espresso.jpg" },
    { name: "Capy-Cappuccino", description: "Warm, frothy, and velvety smooth. Italian classic with delicate foam.", price: 140, category: "hot", image: "/images/capy-cappuccino.jpg" },
    { name: "Capy-Mocha", description: "Indulgent espresso with chocolate syrup and steamed milk.", price: 175, category: "hot", image: "/images/capy-mocha.jpg" },
    { name: "Capy-Flat White", description: "Velvety smooth espresso and steamed milk with microfoam.", price: 125, category: "hot", image: "/images/capy-flat-white.jpg" },
    { name: "Capy-Americano", description: "Espresso topped with hot water for a smooth finish.", price: 130, category: "hot", image: "/images/capy-americano.jpeg" },

    // ❄️ Cold Drinks
    { name: "Capy-Iced Latte", description: "Chilled, refreshing blend of espresso, milk, and ice.", price: 150, category: "cold", image: "/images/capy-iced-latte.jpg" },
    { name: "Capy-Cold Brew", description: "Chilled, bold, and smooth. Brewed for 12 hours.", price: 150, category: "cold", image: "/images/capy-cold-brew.jpg" },
    { name: "Capy-Iced Mocha", description: "Chocolate and espresso chilled with milk and ice.", price: 170, category: "cold", image: "/images/capy-iced-mocha.jpg" },
    { name: "Capy-Iced Coffee", description: "Classic brewed coffee served cold over ice.", price: 140, category: "cold", image: "/images/capy-iced-coffee.webp" },
    { name: "Capy Frosty Frappe", description: "Blended iced coffee with whipped cream topping.", price: 165, category: "cold", image: "/images/capy-frosty-frappe.jpg" },

    // 🥐 Snacks & Pastries
    { name: "Capy Cheese Croissant", description: "Buttery croissant filled with cheese.", price: 80, category: "snacks", image: "/images/capy-cheese-croissant.webp" },
    { name: "Capy Blueberry Muffin", description: "Moist muffin with fresh blueberries.", price: 75, category: "snacks", image: "/images/capy-blueberry-muffin.jpg" },
    { name: "Capy Chocolate Chip Cookie", description: "Classic cookie loaded with chocolate chips.", price: 65, category: "snacks", image: "/images/capy-chocolate-chip-cookie.jpg" },
    { name: "Capy Lemon Tart", description: "Tart with zesty lemon filling and crisp crust.", price: 90, category: "snacks", image: "/images/capy-lemon-tart.jpg" },
    { name: "Capy Banana Bread", description: "Moist banana bread with walnuts.", price: 85, category: "snacks", image: "/images/capy-banana-bread.jpeg" },
  ];

  const filteredMenu = filter === "all" ? menuItems : menuItems.filter((i) => i.category === filter);

  const handleOrderNow = (item: MenuItem) => {
    setSelectedItem(item);
    setSize("medium");
    setMilkType("Whole");
    setQuantity(1);
    setSpecialInstructions("");
    setShowModal(true);
  };

  const calculatePrice = () => {
    if (!selectedItem) return 0;
    let price = selectedItem.price;
    if (selectedItem.category !== "snacks") {
      if (size === "large") price += 20;
      if (size === "grande") price += 40;
    }
    return price * quantity;
  };

  const placeOrder = async () => {
    if (!user) return alert("Please log in first.");

    const orderData = {
      user_email: user.email,
      item_name: selectedItem?.name,
      item_image: selectedItem?.image,
      size,
      milk_type: milkType,
      quantity,
      special_instructions: specialInstructions,
      total_price: calculatePrice(),
    };

    const res = await fetch(apiUrl('/api/orders'), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (res.ok) {
      alert("✅ Order placed!");
      setShowModal(false);
    } else alert("❌ Order failed.");
  };

  return (
    <section className="menu-section">
      <h2>Our Capy Menu</h2>

      <div className="menu-filter">
        {["all", "hot", "cold", "snacks"].map((cat) => (
          <button
            key={cat}
            className={filter === cat ? "active" : ""}
            onClick={() => setFilter(cat)}
          >
            {cat === "all" ? "All" : cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="menu">
        {filteredMenu.map((item) => (
          <div key={item.name} className="menu-item">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p className="price">₱{item.price}</p>
            <button onClick={() => handleOrderNow(item)}>Order Now</button>
          </div>
        ))}
      </div>

      {showModal && selectedItem && (
        <div className="order-form-overlay">
          <div className="order-form-container">
            <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            
            <div className="modal-content-layout">
              <img src={selectedItem.image} alt={selectedItem.name} className="order-form-image" />

              <div className="order-form-fields">
                <h2>{selectedItem.name}</h2>

                {selectedItem.category !== "snacks" && (
                  <>
                    <label>Size:</label>
                    <select value={size} onChange={(e) => setSize(e.target.value)}>
                      <option value="medium">Medium</option>
                      <option value="large">Large (+₱20)</option>
                      <option value="grande">Grande (+₱40)</option>
                    </select>

                    <label>Milk Type:</label>
                    <select value={milkType} onChange={(e) => setMilkType(e.target.value)}>
                      <option>Whole</option>
                      <option>Non-fat</option>
                      <option>Soy Milk</option>
                      <option>Oat Milk</option>
                    </select>
                  </>
                )}

                <label>Quantity:</label>
                <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(+e.target.value)} />

                <label>Special Instructions:</label>
                <textarea value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} />

                <p className="total-display">Total: ₱{calculatePrice()}</p>

                <button className="confirm-btn" onClick={placeOrder}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Menu;