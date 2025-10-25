-- Postgres schema for CoffeeBara SPA

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(100),
  item_name VARCHAR(100) NOT NULL,
  item_image TEXT,
  size VARCHAR(20),
  milk_type VARCHAR(50),
  quantity INT DEFAULT 1,
  special_instructions TEXT,
  total_price NUMERIC(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_email FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);
