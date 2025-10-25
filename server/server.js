import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.json());

const PORT = process.env.PORT || 5002;

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "coffeebara_spa_db"
});

// ✅ CHECK DB CONNECTION
async function ensureConnection() {
  try {
    const conn = await db.getConnection();
    conn.release();
    console.log("✅ Connected to MySQL database successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
}

// ✅ CREATE TABLES IF NOT EXISTS
async function createTables() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_email VARCHAR(100),
      item_name VARCHAR(100) NOT NULL,
      item_image TEXT,
      size VARCHAR(20),
      milk_type VARCHAR(50),
      quantity INT DEFAULT 1,
      special_instructions TEXT,
      total_price DECIMAL(10, 2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `);

  console.log("✅ Tables are ready");
}

await ensureConnection();
await createTables();

// ===== ROUTES =====

// SIGNUP
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required." });

  try {
    const [existing] = await db.query("SELECT email FROM users WHERE email = ?", [email]);
    if (existing.length > 0)
      return res.status(400).json({ message: "Email already registered." });

    const hash = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hash,
    ]);

    res.status(201).json({ message: "Account created successfully." });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Server error during signup. Please try again later." });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0)
      return res.status(400).json({ message: "User not found." });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({ message: "Invalid password." });

    res.json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error during login." });
  }
});

// PLACE ORDER
app.post("/api/orders", async (req, res) => {
  const {
    user_email,
    item_name,
    item_image,
    size,
    milk_type,
    quantity,
    special_instructions,
    total_price,
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO orders (user_email, item_name, item_image, size, milk_type, quantity, special_instructions, total_price)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_email,
        item_name,
        item_image ?? "",
        size ?? "Medium",
        milk_type ?? "Regular Milk",
        quantity ?? 1,
        special_instructions ?? "",
        total_price
      ]
    );

    res.status(201).json({ message: "Order placed successfully", orderId: result.insertId });
  } catch (err) {
    console.error("Order error:", err.message);
    res.status(500).json({ message: "Server error during order placement." });
  }
});

// GET USER ORDERS
app.get("/api/orders/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM orders WHERE user_email = ? ORDER BY created_at DESC", [email]);
    res.json(rows);
  } catch (err) {
    console.error("Order fetch error:", err.message);
    res.status(500).json({ message: "Server error while fetching orders." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// ✅ DELETE ORDER
app.delete("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM orders WHERE id = ?", [id]);
    res.json({ message: "Order deleted successfully." });
  } catch (err) {
    console.error("Delete order error:", err.message);
    res.status(500).json({ message: "Server error while deleting order." });
  }
});

// ✅ UPDATE / EDIT ORDER
app.put("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { size, milk_type, quantity, special_instructions } = req.body;

  try {
    await pool.query(
      `UPDATE orders SET size = ?, milk_type = ?, quantity = ?, special_instructions = ?
       WHERE id = ?`,
      [size, milk_type, quantity, special_instructions, id]
    );

    res.json({ message: "Order updated successfully." });
  } catch (err) {
    console.error("Update order error:", err.message);
    res.status(500).json({ message: "Server error while editing order." });
  }
});
