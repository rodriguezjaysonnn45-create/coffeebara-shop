import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.json());

const PORT = process.env.PORT || 5002;

// Ensure database connection and create tables if needed
async function ensureConnection() {
  try {
    await db.query('SELECT 1');
    console.log('✅ Connected to Postgres database successfully');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
}

async function createTables() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_email VARCHAR(100),
      item_name VARCHAR(100) NOT NULL,
      item_image TEXT,
      size VARCHAR(20),
      milk_type VARCHAR(50),
      quantity INT DEFAULT 1,
      special_instructions TEXT,
      total_price NUMERIC(10, 2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_user_email FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
    );
  `);

  console.log('✅ Tables are ready');
}

await ensureConnection();
await createTables();

// ===== ROUTES =====

// HEALTH CHECK
app.get('/api/health', async (req, res) => {
  try {
    // simple DB check
    await db.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});


// SIGNUP
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required." });

  try {
    const existing = await db.query("SELECT email FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ message: "Email already registered." });

    const hash = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [
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
    const rows = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (rows.rows.length === 0)
      return res.status(400).json({ message: "User not found." });
    const user = rows.rows[0];
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
    const result = await db.query(
      `INSERT INTO orders (user_email, item_name, item_image, size, milk_type, quantity, special_instructions, total_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
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

    res.status(201).json({ message: "Order placed successfully", orderId: result.rows[0].id });
  } catch (err) {
    console.error("Order error:", err.message);
    res.status(500).json({ message: "Server error during order placement." });
  }
});

// GET USER ORDERS
app.get("/api/orders/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const rows = await db.query("SELECT * FROM orders WHERE user_email = $1 ORDER BY created_at DESC", [email]);
    res.json(rows.rows);
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
    await db.query("DELETE FROM orders WHERE id = $1", [id]);
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
    await db.query(
      `UPDATE orders SET size = $1, milk_type = $2, quantity = $3, special_instructions = $4
       WHERE id = $5`,
      [size, milk_type, quantity, special_instructions, id]
    );

    res.json({ message: "Order updated successfully." });
  } catch (err) {
    console.error("Update order error:", err.message);
    res.status(500).json({ message: "Server error while editing order." });
  }
});
