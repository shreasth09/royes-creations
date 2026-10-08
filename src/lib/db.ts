import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';
import { Product, Order, OrderItem, DashboardStats, AdminUser } from '@/types';
import bcrypt from 'bcryptjs';

const DB_DIR = process.env.VERCEL
  ? path.join('/tmp', 'royes_data')
  : path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'royes.db');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  try {
    fs.mkdirSync(DB_DIR, { recursive: true });
  } catch (e) {
    // Ignore in read-only environment
  }
}

// Global database singleton to avoid multiple connections in development hot reload
let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    // Enable WAL mode, busy timeout, and foreign keys for high performance & multi-worker concurrency
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    dbInstance.exec('PRAGMA busy_timeout = 5000;');
    dbInstance.exec('PRAGMA synchronous = NORMAL;');
    dbInstance.exec('PRAGMA foreign_keys = ON;');
    initSchema(dbInstance);
  }
  return dbInstance;
}

function initSchema(db: DatabaseSync) {
  const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema);
  } else {
    // Fallback if schema.sql isn't located
    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        original_price INTEGER,
        image TEXT NOT NULL,
        images TEXT,
        category TEXT DEFAULT 'Handcrafted',
        specifications TEXT,
        stock INTEGER DEFAULT 15,
        active INTEGER DEFAULT 1,
        is_featured INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        mobile TEXT NOT NULL,
        email TEXT,
        house_flat TEXT NOT NULL,
        street_area TEXT NOT NULL,
        landmark TEXT,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        pincode TEXT NOT NULL,
        subtotal INTEGER NOT NULL,
        delivery_charge INTEGER NOT NULL,
        total_amount INTEGER NOT NULL,
        payment_method TEXT DEFAULT 'UPI',
        payment_status TEXT DEFAULT 'Pending Verification',
        order_status TEXT DEFAULT 'Pending Verification',
        utr TEXT,
        payment_screenshot TEXT,
        notes TEXT,
        admin_notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        product_name_snapshot TEXT NOT NULL,
        product_image_snapshot TEXT,
        price_snapshot INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        item_total INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS store_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  // Ensure default admin user exists
  ensureDefaultAdmin(db);
  // Ensure default settings exist
  ensureDefaultSettings(db);
  // Ensure 5 flagship launch products exist
  ensureInitialProducts(db);
}

function ensureInitialProducts(db: DatabaseSync) {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
  if (!countRow || Number(countRow.count) === 0) {
    const insertProductStmt = db.prepare(`
      INSERT INTO products (name, slug, description, price, original_price, image, images, category, specifications, stock, active, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialProducts = [
      {
        name: 'Handcrafted Blue Pottery Ceramic Vase',
        slug: 'handcrafted-blue-pottery-ceramic-vase',
        description: 'Authentic Jaipur artisanal blue pottery vase featuring traditional geometric and floral motifs. Hand-thrown by master artisans in Jaipur using quartz powder and Egyptian paste techniques. Perfect as a statement centerpiece for living spaces and gifting.',
        price: 1199,
        original_price: 1599,
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1000&q=80',
        ]),
        category: 'Home Decor',
        specifications: JSON.stringify({
          'Origin': 'Jaipur, Rajasthan',
          'Material': 'Traditional Quartz Blue Pottery',
          'Height': '10 inches (25.4 cm)',
          'Finish': 'Glossy Glazed',
          'Care': 'Wipe with soft damp cloth. Avoid harsh abrasives.',
        }),
        stock: 25,
        active: 1,
        is_featured: 1,
      },
      {
        name: 'Pure Brass Floral Dhoop & Incense Diffuser',
        slug: 'pure-brass-floral-dhoop-incense-diffuser',
        description: 'Intricately etched pure brass incense burner with lid perforations inspired by royal Rajasthani haveli jaali work. Handcrafted with heavy-gauge brass to retain natural luster and provide soothing aroma diffusion for your home temple and relaxation areas.',
        price: 899,
        original_price: 1249,
        image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1000&q=80',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=1000&q=80',
        ]),
        category: 'Spiritual & Fragrance',
        specifications: JSON.stringify({
          'Origin': 'Rajasthan',
          'Material': '100% Solid Brass',
          'Weight': '420 grams',
          'Dimensions': '4.5 x 4.5 x 5 inches',
          'Craft': 'Hand-turned & Die Carved',
        }),
        stock: 40,
        active: 1,
        is_featured: 1,
      },
      {
        name: 'Sanganeri Hand Block Print Cotton Table Runner',
        slug: 'sanganeri-hand-block-print-cotton-table-runner',
        description: 'Pure 100% slub cotton table runner handcrafted with traditional teak wood blocks in Sanganer, Jaipur. Uses non-toxic vegetable-based dyes with timeless floral buti borders to elevate your dining table or console decor.',
        price: 749,
        original_price: 999,
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1000&q=80',
        ]),
        category: 'Table Linen',
        specifications: JSON.stringify({
          'Craft': 'Traditional Hand Block Print (Sanganer)',
          'Fabric': '100% Premium Pure Cotton Slub',
          'Size': '14 x 72 inches (Suitable for 6-seater)',
          'Color Fastness': 'Treated for durable home wash',
        }),
        stock: 30,
        active: 1,
        is_featured: 1,
      },
      {
        name: 'Hand-Hammered Brass Lotus Urli with Tealights',
        slug: 'hand-hammered-brass-lotus-urli-with-tealights',
        description: 'Spectacular handcrafted lotus urli bowl featuring hammered texture and curved petal rim. Ideal for floating fresh marigold petals, rosebuds, and floating candles during festive occasions, poojas, or welcoming guests at the entryway.',
        price: 1549,
        original_price: 2199,
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
        ]),
        category: 'Festive & Decor',
        specifications: JSON.stringify({
          'Origin': 'Jaipur Metal Art Guild',
          'Diameter': '12 inches',
          'Finish': 'Polished Brass Hammered Surface',
          'Includes': 'Urli Bowl + 4 Brass Floating Tealight Cups',
        }),
        stock: 18,
        active: 1,
        is_featured: 1,
      },
      {
        name: 'Luxury Botanical Soy Wax Scented Candle in Ceramic Jar',
        slug: 'luxury-botanical-soy-wax-scented-candle-ceramic-jar',
        description: 'Hand-poured 100% natural soy wax candle infused with therapeutic grade Mogra & Royal Sandalwood essential oils. Housed in a reusable artisan ceramic container thrown in Jaipur. Clean, soot-free burn with up to 50 hours of aromatic tranquility.',
        price: 649,
        original_price: 899,
        image: 'https://images.unsplash.com/photo-1570823635306-250abb06d4b3?auto=format&fit=crop&w=1000&q=80',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1570823635306-250abb06d4b3?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80',
        ]),
        category: 'Aromatherapy',
        specifications: JSON.stringify({
          'Wax Type': '100% Natural Biodegradable Soy Wax',
          'Fragrance': 'Jaipur Mogra & Mysore Sandalwood',
          'Burn Time': '45-50 Hours',
          'Container': 'Reusable Handcrafted Terracotta Ceramic Jar',
        }),
        stock: 50,
        active: 1,
        is_featured: 1,
      },
    ];

    for (const p of initialProducts) {
      insertProductStmt.run(
        p.name,
        p.slug,
        p.description,
        p.price,
        p.original_price,
        p.image,
        p.images,
        p.category,
        p.specifications,
        p.stock,
        p.active,
        p.is_featured
      );
    }
  }
}

function ensureDefaultAdmin(db: DatabaseSync) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@royescreations.com';
  const existing = db.prepare('SELECT id FROM admins WHERE email = ?').get(adminEmail);
  if (!existing) {
    const rawPassword = process.env.ADMIN_PASSWORD || 'RoyesAdmin2026!';
    const passwordHash = bcrypt.hashSync(rawPassword, 10);
    db.prepare(`
      INSERT INTO admins (username, email, password_hash, name, role)
      VALUES (?, ?, ?, ?, ?)
    `).run('admin', adminEmail, passwordHash, 'Royes Creations Admin', 'superadmin');
  }
}

function ensureDefaultSettings(db: DatabaseSync) {
  const defaults: Record<string, string> = {
    upi_id: process.env.NEXT_PUBLIC_UPI_ID || 'royescreations@upi',
    upi_payee_name: process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || 'Royes Creations',
    delivery_city: 'Jaipur',
    delivery_fee: '49',
    free_delivery_threshold: '1499',
    store_notice: 'Delivering Exclusively within Jaipur, Rajasthan',
  };

  for (const [key, val] of Object.entries(defaults)) {
    const existing = db.prepare('SELECT id FROM store_settings WHERE key = ?').get(key);
    if (!existing) {
      db.prepare('INSERT INTO store_settings (key, value) VALUES (?, ?)').run(key, val);
    }
  }
}

// ================= PRODUCT REPOSITORY =================
export function getProducts(options?: { onlyActive?: boolean; featuredOnly?: boolean; limit?: number }): Product[] {
  const db = getDb();
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params: (number | string)[] = [];

  if (options?.onlyActive !== false) {
    sql += ' AND active = 1';
  }
  if (options?.featuredOnly) {
    sql += ' AND is_featured = 1';
  }
  sql += ' ORDER BY id ASC';
  if (options?.limit) {
    sql += ' LIMIT ?';
    params.push(options.limit);
  }

  const rows = db.prepare(sql).all(...params) as any[];
  return rows.map(formatProduct);
}

export function getProductBySlug(slug: string): Product | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM products WHERE slug = ?').get(slug) as any;
  return row ? formatProduct(row) : null;
}

export function getProductById(id: number): Product | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
  return row ? formatProduct(row) : null;
}

export function createProduct(data: Partial<Product>): Product {
  const db = getDb();
  const slug = data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `prod-${Date.now()}`;
  const images = Array.isArray(data.images) ? JSON.stringify(data.images) : (data.images || JSON.stringify([data.image]));
  const specifications = typeof data.specifications === 'object' ? JSON.stringify(data.specifications) : (data.specifications || '{}');

  const stmt = db.prepare(`
    INSERT INTO products (name, slug, description, price, original_price, image, images, category, specifications, stock, active, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    data.name || 'Untitled Product',
    slug,
    data.description || '',
    data.price || 0,
    data.original_price || null,
    data.image || '',
    images,
    data.category || 'Handcrafted',
    specifications,
    data.stock !== undefined ? data.stock : 10,
    data.active === false || data.active === 0 ? 0 : 1,
    data.is_featured === false || data.is_featured === 0 ? 0 : 1
  );

  return getProductById(Number(result.lastInsertRowid))!;
}

export function updateProduct(id: number, data: Partial<Product>): Product | null {
  const db = getDb();
  const existing = getProductById(id);
  if (!existing) return null;

  const name = data.name ?? existing.name;
  const slug = data.slug ?? existing.slug;
  const description = data.description ?? existing.description;
  const price = data.price ?? existing.price;
  const original_price = data.original_price !== undefined ? data.original_price : (existing.original_price ?? null);
  const image = data.image ?? existing.image;
  const images = data.images ? (Array.isArray(data.images) ? JSON.stringify(data.images) : data.images) : (Array.isArray(existing.images) ? JSON.stringify(existing.images) : (existing.images ?? null));
  const category = data.category ?? existing.category;
  const specifications = data.specifications ? (typeof data.specifications === 'object' ? JSON.stringify(data.specifications) : data.specifications) : (typeof existing.specifications === 'object' ? JSON.stringify(existing.specifications) : (existing.specifications ?? null));
  const stock = data.stock !== undefined ? data.stock : existing.stock;
  const active = data.active !== undefined ? (data.active ? 1 : 0) : (existing.active ? 1 : 0);
  const is_featured = data.is_featured !== undefined ? (data.is_featured ? 1 : 0) : (existing.is_featured ? 1 : 0);

  db.prepare(`
    UPDATE products
    SET name = ?, slug = ?, description = ?, price = ?, original_price = ?, image = ?, images = ?, category = ?, specifications = ?, stock = ?, active = ?, is_featured = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    name,
    slug,
    description,
    price,
    original_price ?? null,
    image,
    (images as string) ?? null,
    category,
    (specifications as string) ?? null,
    stock,
    active,
    is_featured,
    id
  );

  return getProductById(id);
}

export function deleteProduct(id: number): boolean {
  const db = getDb();
  const res = db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return Number(res.changes) > 0;
}

function formatProduct(row: any): Product {
  let images: string[] = [];
  try {
    if (row.images) {
      images = typeof row.images === 'string' ? JSON.parse(row.images) : row.images;
    } else if (row.image) {
      images = [row.image];
    }
  } catch {
    images = [row.image];
  }

  let specifications: Record<string, string> = {};
  try {
    if (row.specifications) {
      specifications = typeof row.specifications === 'string' ? JSON.parse(row.specifications) : row.specifications;
    }
  } catch {
    specifications = {};
  }

  return {
    ...row,
    images,
    specifications,
    active: Boolean(row.active),
    is_featured: Boolean(row.is_featured),
  };
}

// ================= ORDER REPOSITORY =================
export function createOrder(data: {
  order_number: string;
  customer_name: string;
  mobile: string;
  email?: string;
  house_flat: string;
  street_area: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  delivery_charge: number;
  total_amount: number;
  payment_method: string;
  utr?: string;
  payment_screenshot?: string;
  notes?: string;
  items: {
    product_id: number;
    product_name_snapshot: string;
    product_image_snapshot?: string;
    price_snapshot: number;
    quantity: number;
    item_total: number;
  }[];
}): Order {
  const db = getDb();

  // Insert order inside transaction
  db.exec('BEGIN TRANSACTION;');
  try {
    const orderStmt = db.prepare(`
      INSERT INTO orders (
        order_number, customer_name, mobile, email, house_flat, street_area, landmark,
        city, state, pincode, subtotal, delivery_charge, total_amount, payment_method,
        payment_status, order_status, utr, payment_screenshot, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const orderRes = orderStmt.run(
      data.order_number,
      data.customer_name,
      data.mobile,
      data.email || null,
      data.house_flat,
      data.street_area,
      data.landmark || null,
      data.city,
      data.state,
      data.pincode,
      data.subtotal,
      data.delivery_charge,
      data.total_amount,
      data.payment_method || 'UPI',
      'Pending Verification',
      'Pending Verification',
      data.utr || null,
      data.payment_screenshot || null,
      data.notes || null
    );

    const orderId = Number(orderRes.lastInsertRowid);

    const itemStmt = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name_snapshot, product_image_snapshot, price_snapshot, quantity, item_total)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    // Reduce stock for products
    const updateStockStmt = db.prepare(`
      UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?
    `);

    for (const item of data.items) {
      itemStmt.run(
        orderId,
        item.product_id,
        item.product_name_snapshot,
        item.product_image_snapshot || null,
        item.price_snapshot,
        item.quantity,
        item.item_total
      );

      if (item.product_id) {
        updateStockStmt.run(item.quantity, item.product_id);
      }
    }

    db.exec('COMMIT;');
    return getOrderById(orderId)!;
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

export function getOrderById(id: number): Order | null {
  const db = getDb();
  const orderRow = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as any;
  if (!orderRow) return null;

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(id) as unknown as OrderItem[];
  return {
    ...orderRow,
    items,
  };
}

export function getOrderByNumber(orderNumber: string): Order | null {
  const db = getDb();
  const orderRow = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(orderNumber) as any;
  if (!orderRow) return null;

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderRow.id) as unknown as OrderItem[];
  return {
    ...orderRow,
    items,
  };
}

export function getOrderByNumberAndMobile(orderNumber: string, mobile: string): Order | null {
  const db = getDb();
  const cleanMobile = mobile.trim().replace(/\D/g, '').slice(-10);
  const cleanOrderNumber = orderNumber.trim().toUpperCase();

  const orderRow = db.prepare(`
    SELECT * FROM orders
    WHERE UPPER(order_number) = ?
    AND (mobile LIKE '%' || ? OR mobile = ?)
  `).get(cleanOrderNumber, cleanMobile, mobile) as any;

  if (!orderRow) return null;

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderRow.id) as unknown as OrderItem[];
  return {
    ...orderRow,
    items,
  };
}

export function getAllOrders(filters?: {
  search?: string;
  order_status?: string;
  payment_status?: string;
  limit?: number;
  offset?: number;
}): { orders: Order[]; total: number } {
  const db = getDb();
  let whereClauses: string[] = ['1=1'];
  const params: any[] = [];

  if (filters?.search) {
    const s = `%${filters.search.trim()}%`;
    whereClauses.push('(order_number LIKE ? OR customer_name LIKE ? OR mobile LIKE ? OR utr LIKE ?)');
    params.push(s, s, s, s);
  }

  if (filters?.order_status) {
    whereClauses.push('order_status = ?');
    params.push(filters.order_status);
  }

  if (filters?.payment_status) {
    whereClauses.push('payment_status = ?');
    params.push(filters.payment_status);
  }

  const whereSql = whereClauses.join(' AND ');

  const totalRow = db.prepare(`SELECT COUNT(*) as count FROM orders WHERE ${whereSql}`).get(...params) as any;
  const total = totalRow ? Number(totalRow.count) : 0;

  let querySql = `SELECT * FROM orders WHERE ${whereSql} ORDER BY id DESC`;
  const queryParams = [...params];

  if (filters?.limit) {
    querySql += ' LIMIT ? OFFSET ?';
    queryParams.push(filters.limit, filters.offset || 0);
  }

  const orderRows = db.prepare(querySql).all(...queryParams) as any[];

  // Attach items to each order
  const orders: Order[] = orderRows.map((row) => {
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(row.id) as unknown as OrderItem[];
    return {
      ...row,
      items,
    };
  });

  return { orders, total };
}

export function updateOrder(
  id: number,
  updates: {
    order_status?: string;
    payment_status?: string;
    admin_notes?: string;
    utr?: string;
  }
): Order | null {
  const db = getDb();
  const existing = getOrderById(id);
  if (!existing) return null;

  const order_status = updates.order_status ?? existing.order_status;
  const payment_status = updates.payment_status ?? existing.payment_status;
  const admin_notes = updates.admin_notes !== undefined ? updates.admin_notes : existing.admin_notes;
  const utr = updates.utr !== undefined ? updates.utr : existing.utr;

  db.prepare(`
    UPDATE orders
    SET order_status = ?, payment_status = ?, admin_notes = ?, utr = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(order_status, payment_status, admin_notes || null, utr || null, id);

  return getOrderById(id);
}

// ================= DASHBOARD STATS =================
export function getDashboardStats(): DashboardStats {
  const db = getDb();

  const totalOrdersRow = db.prepare('SELECT COUNT(*) as count FROM orders').get() as any;
  const totalOrders = Number(totalOrdersRow?.count || 0);

  // Total sales from orders where payment is verified or order confirmed/delivered
  const totalSalesRow = db.prepare(`
    SELECT SUM(total_amount) as sum FROM orders
    WHERE payment_status = 'Payment Verified' OR order_status NOT IN ('Cancelled', 'Pending Verification')
  `).get() as any;
  const totalSales = Number(totalSalesRow?.sum || 0);

  const pendingVerificationRow = db.prepare(`
    SELECT COUNT(*) as count FROM orders
    WHERE payment_status = 'Pending Verification' AND order_status != 'Cancelled'
  `).get() as any;
  const pendingVerificationCount = Number(pendingVerificationRow?.count || 0);

  const outForDeliveryRow = db.prepare(`
    SELECT COUNT(*) as count FROM orders WHERE order_status = 'Out for Delivery'
  `).get() as any;
  const outForDeliveryCount = Number(outForDeliveryRow?.count || 0);

  const deliveredRow = db.prepare(`
    SELECT COUNT(*) as count FROM orders WHERE order_status = 'Delivered'
  `).get() as any;
  const deliveredCount = Number(deliveredRow?.count || 0);

  const cancelledRow = db.prepare(`
    SELECT COUNT(*) as count FROM orders WHERE order_status = 'Cancelled'
  `).get() as any;
  const cancelledCount = Number(cancelledRow?.count || 0);

  const totalProductsRow = db.prepare('SELECT COUNT(*) as count FROM products WHERE active = 1').get() as any;
  const totalProducts = Number(totalProductsRow?.count || 0);

  const recentRows = db.prepare('SELECT * FROM orders ORDER BY id DESC LIMIT 5').all() as any[];
  const recentOrders = recentRows.map((row) => {
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(row.id) as unknown as OrderItem[];
    return { ...row, items };
  });

  return {
    totalOrders,
    totalSales,
    pendingVerificationCount,
    outForDeliveryCount,
    deliveredCount,
    cancelledCount,
    totalProducts,
    recentOrders,
  };
}

// ================= AUTH REPOSITORY =================
export function getAdminByEmail(email: string): (AdminUser & { password_hash: string }) | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM admins WHERE email = ? OR username = ?').get(email, email) as any;
  return row || null;
}

export function getAdminById(id: number): AdminUser | null {
  const db = getDb();
  const row = db.prepare('SELECT id, username, email, name, role, created_at FROM admins WHERE id = ?').get(id) as any;
  return row || null;
}

// ================= SETTINGS REPOSITORY =================
export function getStoreSetting(key: string): string | null {
  const db = getDb();
  const row = db.prepare('SELECT value FROM store_settings WHERE key = ?').get(key) as any;
  return row ? row.value : null;
}

export function setStoreSetting(key: string, value: string): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO store_settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `).run(key, value);
}

export function getAllStoreSettings(): Record<string, string> {
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM store_settings').all() as any[];
  const settings: Record<string, string> = {};
  for (const r of rows) {
    settings[r.key] = r.value;
  }
  return settings;
}
