-- ==========================================================
-- Royes Creations PostgreSQL Production Schema
-- Designed for Neon, Supabase, Vercel Postgres, AWS RDS
-- ==========================================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  image TEXT NOT NULL,
  images TEXT,
  category VARCHAR(100) DEFAULT 'Handcrafted',
  specifications TEXT,
  stock INTEGER DEFAULT 15,
  active SMALLINT DEFAULT 1,
  is_featured SMALLINT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  house_flat TEXT NOT NULL,
  street_area TEXT NOT NULL,
  landmark TEXT,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  subtotal INTEGER NOT NULL,
  delivery_charge INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'UPI',
  payment_status VARCHAR(50) DEFAULT 'Pending Verification',
  order_status VARCHAR(50) DEFAULT 'Pending Verification',
  utr VARCHAR(100),
  payment_screenshot TEXT,
  notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name_snapshot VARCHAR(255) NOT NULL,
  product_image_snapshot TEXT,
  price_snapshot INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  item_total INTEGER NOT NULL
);

-- 4. Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Store Settings Table
CREATE TABLE IF NOT EXISTS store_settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance & query optimization
CREATE INDEX IF NOT EXISTS idx_pg_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_pg_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_pg_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_pg_orders_mobile ON orders(mobile);
CREATE INDEX IF NOT EXISTS idx_pg_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_pg_order_items_order_id ON order_items(order_id);
