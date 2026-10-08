const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcryptjs');

const DB_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DB_DIR, 'royes.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Initialize schema
const schemaPath = path.join(__dirname, '..', 'src', 'lib', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

console.log('📦 Database schema initialized successfully.');

// Initial 5 Products for Royes Creations
// These products represent Royes Creations' authentic handicraft & home aesthetic.
// They can be instantly modified in the Admin Dashboard or replaced with the user's specific photos & details.
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
    price: 1549, // Note: Above ₹1499, immediately unlocks FREE DELIVERY!
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

// Seed Products
const insertProductStmt = db.prepare(`
  INSERT INTO products (name, slug, description, price, original_price, image, images, category, specifications, stock, active, is_featured)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const p of initialProducts) {
  const existing = db.prepare('SELECT id FROM products WHERE slug = ?').get(p.slug);
  if (!existing) {
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
    console.log(`✅ Seeded product: ${p.name}`);
  } else {
    console.log(`ℹ️ Product already exists: ${p.name}`);
  }
}

// Seed Admin User
const adminEmail = 'admin@royescreations.com';
const existingAdmin = db.prepare('SELECT id FROM admins WHERE email = ?').get(adminEmail);
if (!existingAdmin) {
  const hash = bcrypt.hashSync('RoyesAdmin2026!', 10);
  db.prepare(`
    INSERT INTO admins (username, email, password_hash, name, role)
    VALUES (?, ?, ?, ?, ?)
  `).run('admin', adminEmail, hash, 'Royes Creations Admin', 'superadmin');
  console.log(`🔑 Seeded admin user: ${adminEmail} (Password: RoyesAdmin2026!)`);
} else {
  console.log(`ℹ️ Admin user already exists: ${adminEmail}`);
}

// Seed Store Settings
const storeSettings = [
  ['upi_id', 'royescreations@upi'],
  ['upi_payee_name', 'Royes Creations'],
  ['delivery_city', 'Jaipur'],
  ['delivery_state', 'Rajasthan'],
  ['delivery_fee', '49'],
  ['free_delivery_threshold', '1499'],
  ['support_mobile', '+91 98290 12345'],
  ['support_email', 'contact@royescreations.com'],
  ['founders', 'Shreasth Chaturvedi & Samiksha Chaturvedi'],
];

const insertSettingStmt = db.prepare(`
  INSERT INTO store_settings (key, value)
  VALUES (?, ?)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value
`);

for (const [key, value] of storeSettings) {
  insertSettingStmt.run(key, value);
}
console.log('⚙️ Seeded store settings successfully.');

console.log('✨ Database seeding complete!');
