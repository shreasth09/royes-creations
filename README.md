# Royes Creations — Production D2C E-Commerce Platform

> **"Thoughtfully Chosen. Beautifully Delivered."**  
> Direct-to-Consumer e-commerce platform for **Royes Creations**, founded by **Shreasth Chaturvedi** and **Samiksha Chaturvedi**. Transitioning from high-volume marketplace selling (Meesho, Amazon, Flipkart) to an exclusive, brand-owned storefront.

---

## 🏛️ Executive Summary & Key Highlights

- **100% Functional Full-Stack System**: Includes customer storefront, product catalog, cart drawer & page, anti-tamper checkout, live order tracking, and merchant administration portal.
- **Jaipur-Exclusive Delivery**: Geographically restricted strictly to Jaipur, Rajasthan with automated 6-digit PIN code and area verification.
- **Strict Delivery Charge Logic**:
  - Cart Subtotal $\le$ ₹1499 $\rightarrow$ **₹49 Delivery Charge**
  - Cart Subtotal $>$ ₹1499 $\rightarrow$ **₹0 (FREE DELIVERY)**
  - Re-computed independently on the server to prevent client-side price tampering.
- **Prepaid UPI / QR Payment Flow (Zero COD)**:
  - Official Royes Creations UPI QR code display & dynamic amount payload.
  - Native Mobile deep-link for instant checkout via Google Pay, PhonePe, Paytm, or BHIM.
  - 12-digit UTR / UPI reference number submission + optional payment screenshot upload.
  - Initial status: `Pending Payment Verification`.
  - Admin 1-click verification workflow.
- **Full Relational Database**: Powered by native SQLite/Node with ACID transactions, WAL mode, prepared statements, and standard SQL migration compatibility.
- **No Account Required for Customers**: Effortless order tracking via `Order ID` + `Mobile Number`.

---

## 📁 Project Architecture & File Structure

```
royes-creations/
├── data/
│   └── royes.db                     # Relational SQLite database with WAL mode
├── public/
│   ├── images/
│   │   ├── products/                # Product photos
│   │   └── brand/                   # Brand logos and banners
│   └── uploads/                     # Customer payment receipts & product uploads
├── scripts/
│   ├── seed.js                      # Database seeder (5 initial products & admin)
│   └── test-flow.js                 # Automated end-to-end business rule test suite
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── login/page.tsx       # Admin authentication screen
│   │   │   ├── AdminDashboardClient.tsx # Full Merchant Admin Dashboard
│   │   │   └── page.tsx             # Protected Admin Portal
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── auth/            # Admin login, logout, and session check
│   │   │   │   ├── orders/          # Order lookup, status update, 1-click verify
│   │   │   │   ├── products/        # Product CRUD (Add, Edit, Delete, Toggle)
│   │   │   │   ├── settings/        # Store settings (UPI, QR, Delivery charges)
│   │   │   │   └── stats/           # Real-time dashboard KPI metrics
│   │   │   ├── orders/route.ts      # Checkout & server-side recalculation
│   │   │   ├── products/route.ts    # Public catalogue API
│   │   │   ├── track/route.ts       # Public order tracking API
│   │   │   └── upload/route.ts      # Image & receipt upload handler
│   │   ├── cart/page.tsx            # Dedicated shopping bag page
│   │   ├── checkout/page.tsx        # Jaipur checkout with live PIN checker & UPI
│   │   ├── order-success/[orderNumber]/page.tsx # Order confirmation & timeline
│   │   ├── product/[slug]/page.tsx  # Product detail page with gallery & specs
│   │   ├── shop/page.tsx            # Searchable & filterable catalogue
│   │   ├── layout.tsx               # Root layout with CartProvider & SEO
│   │   ├── page.tsx                 # Brand homepage with Hero, Story & 5 Products
│   │   ├── robots.ts                # Search engine crawlers config
│   │   └── sitemap.ts               # Dynamic XML sitemap generator
│   ├── components/
│   │   ├── cart/CartDrawer.tsx      # Slide-over cart drawer with free delivery bar
│   │   ├── layout/
│   │   │   ├── AnnouncementBar.tsx  # Top Jaipur announcement banner
│   │   │   ├── Navbar.tsx           # Brand header with badge counter
│   │   │   └── Footer.tsx           # Footer with founders story & Jaipur terms
│   │   ├── product/
│   │   │   ├── PincodeChecker.tsx   # Interactive Jaipur PIN validator
│   │   │   └── ProductCard.tsx      # Premium product display card
│   │   └── ui/Toast.tsx             # Notification toast alerts
│   ├── lib/
│   │   ├── auth.ts                  # JWT token creation & verification
│   │   ├── cart-context.tsx         # Client cart state & persistence
│   │   ├── db.ts                    # Database access layer & repositories
│   │   ├── delivery.ts              # Jaipur PIN code registry & delivery fees
│   │   └── schema.sql               # Relational SQL schema
│   └── types/index.ts               # TypeScript data models
├── .env                             # Active environment configuration
├── .env.example                     # Environment template
├── next.config.js                   # Next.js & Webpack configuration
├── package.json                     # Dependencies & npm scripts
├── tailwind.config.js               # Artisanal luxury color palette & typography
└── tsconfig.json                    # TypeScript configuration
```

---

## 📦 Initial 5 Flagship Seed Products

The platform is seeded with 5 curated artisanal creations representing Royes Creations' authentic craftsmanship:

| # | Product Name | Category | Price | MRP | Free Delivery Status |
|---|---|---|---|---|---|
| 1 | **Handcrafted Blue Pottery Ceramic Vase** | Home Decor | ₹1,199 | ₹1,599 | ₹49 delivery (Subtotal $\le$ ₹1499) |
| 2 | **Pure Brass Floral Dhoop & Incense Diffuser** | Spiritual & Fragrance | ₹899 | ₹1,249 | ₹49 delivery (Subtotal $\le$ ₹1499) |
| 3 | **Sanganeri Hand Block Print Table Runner** | Table Linen | ₹749 | ₹999 | ₹49 delivery (Subtotal $\le$ ₹1499) |
| 4 | **Hand-Hammered Brass Lotus Urli with Tealights** | Festive & Decor | **₹1,549** | ₹2,199 | **FREE DELIVERY** (Subtotal $>$ ₹1499) |
| 5 | **Botanical Soy Wax Candle in Ceramic Jar** | Aromatherapy | ₹649 | ₹899 | ₹49 delivery (Subtotal $\le$ ₹1499) |

> 💡 *Note: All 5 products can be renamed, priced, or given custom photos directly inside the **Admin Dashboard** without writing any code.*

---

## 🚚 Jaipur Delivery & Business Rules

### 1. Delivery Radius Restriction
- Delivery is strictly confined to **Jaipur, Rajasthan**.
- The system validates both the **City name** and **6-digit PIN code**.
- Supported urban and peri-urban Jaipur postal codes:
  - `302001` (C-Scheme / GPO)
  - `302004` (Raja Park)
  - `302015` (Tonk Road / Bajaj Nagar)
  - `302017` (Malviya Nagar / Jagatpura)
  - `302020` (Mansarovar)
  - `302021` (Vaishali Nagar)
  - `302022` (Sitapura / Pratap Nagar)
  - `302039` (Vidhyadhar Nagar)
  - All `302xxx` and `303xxx` codes within Jaipur district.
- Orders originating outside Jaipur are rejected server-side with an informative message.

### 2. Delivery Charge Calculation
- **Subtotal $\le$ ₹1499**: Flat ₹49 delivery fee.
- **Subtotal $>$ ₹1499**: ₹0 (**FREE Delivery**).
- Dynamic progress indicators inform customers:  
  *“Add ₹XXX more to get FREE delivery”* $\rightarrow$ *“You’ve unlocked FREE delivery.”*

---

## 💳 Prepaid UPI & Payment Verification Flow

1. **Prepaid Only**: Cash on Delivery (COD) is strictly disabled across the entire application.
2. **Dynamic QR Code**: Rendered using standard UPI URI specifications (`upi://pay?pa=...&pn=...&am=...&cu=INR`).
3. **Mobile Intent Link**: On smartphones, customers can click a button to open Google Pay, PhonePe, Paytm, or BHIM directly with the exact order total pre-filled.
4. **Customer Verification**:
   - Customer submits their **12-digit UPI UTR / Transaction Reference ID**.
   - Customer can optionally attach an image screenshot of their payment receipt.
5. **Initial Order Status**: Set to `Pending Verification`.
6. **Merchant Action**:
   - The business owner opens the **Admin Portal** $\rightarrow$ checks incoming orders $\rightarrow$ clicks **Verify Payment** in 1 click.
   - The order status automatically advances to `Payment Verified` $\rightarrow$ `Order Confirmed` $\rightarrow$ `Packed` $\rightarrow$ `Out for Delivery` $\rightarrow$ `Delivered`.

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development

# Database path
DATABASE_PATH=./data/royes.db

# Security & JWT Authentication
JWT_SECRET=royes_creations_super_secret_jwt_key_2026_jaipur_production_quality
ADMIN_EMAIL=admin@royescreations.com
ADMIN_PASSWORD=RoyesAdmin2026!

# Business Settings (Defaults)
NEXT_PUBLIC_BRAND_NAME="Royes Creations"
NEXT_PUBLIC_UPI_ID=royescreations@upi
NEXT_PUBLIC_UPI_PAYEE_NAME="Royes Creations"
NEXT_PUBLIC_DELIVERY_CITY="Jaipur"
NEXT_PUBLIC_DELIVERY_STATE="Rajasthan"
NEXT_PUBLIC_DELIVERY_FEE=49
NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD=1499
```

---

## 🚀 Installation & Local Development

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v20+ / v24 LTS recommended)
- **npm** or **pnpm**

### 2. Installation
```powershell
# Navigate into the project folder
cd "C:\Users\Shreasth chaturvedi\.gemini\antigravity\scratch\royes-creations"

# Install dependencies (already installed)
npm install
```

### 3. Initialize & Seed Database
```powershell
# Create tables and seed 5 flagship products + admin user
npm run seed
```

### 4. Run Development Server
```powershell
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Production Build & Start
```powershell
npm run build
npm run start
```

---

## 🔐 Admin Portal & Store Management

- **Admin URL**: `http://localhost:3000/admin`
- **Login URL**: `http://localhost:3000/admin/login`
- **Default Email**: `admin@royescreations.com`
- **Default Password**: `RoyesAdmin2026!`

### Capabilities in Admin Panel:
1. **Order Management**:
   - Filter by Order Status (`Pending Verification`, `Confirmed`, `Out for Delivery`, etc.).
   - Search by Order ID, Mobile number, or Customer Name.
   - Inspect customer address, ordered items, and submitted UTR.
   - Zoom in on customer payment screenshots.
   - 1-click **Verify Payment** button.
   - Update delivery status or add private admin notes.
2. **Product Management**:
   - **Add New Products**: Upload product photos or provide image URLs, set pricing, original MRP, stock, description, and category.
   - **Edit Products**: Update price, inventory count, or description at any time.
   - **Disable/Enable Products**: Toggle visibility on the customer storefront with one click.
   - **Delete Products**.
3. **Store & UPI Settings**:
   - Update your **Official UPI ID** and **Payee Name** directly from the UI without editing code.
   - Adjust delivery charges and the free delivery threshold.

---

## 🧪 Automated Testing & Verification

Run the built-in end-to-end verification script:
```powershell
node scripts/test-flow.js
```

This automated suite runs 8 test cases:
1. Catalog product count validation.
2. Location restriction validation (blocks non-Jaipur addresses).
3. Delivery charge validation for orders $\le$ ₹1499 (charges ₹49).
4. Free delivery validation for orders $>$ ₹1499 (charges ₹0).
5. Public order tracking validation via Order ID + Mobile.
6. Admin authentication and JWT generation.
7. Admin 1-click payment verification.
8. Real-time dashboard KPI analytics.

---

## 🌐 Production Deployment Guide

### Option 1: Vercel / Railway / Render
1. Push the code to a GitHub repository.
2. Set Environment Variables in your hosting dashboard (`JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_UPI_ID`, etc.).
3. If using SQLite on a persistent disk (Railway/Render/VPS), mount `./data`.
4. If deploying to serverless platforms like Vercel with PostgreSQL or Supabase, point the schema to PostgreSQL using the provided `src/lib/schema.sql`.

### Option 2: Linux / Windows VPS (PM2 or Docker)
```bash
# Build production bundle
npm run build

# Start with PM2 process manager
npm install -g pm2
pm2 start npm --name "royes-creations" -- start
```

---

## 👥 Brand Presentation

**Royes Creations**  
- **Founders**: Shreasth Chaturvedi & Samiksha Chaturvedi  
- **Origin**: Jaipur, Rajasthan, India  
- **Core Values**: Handcrafted Authenticity, Fair Pricing, Transparent Prepaid Checkout, Reliable Jaipur Handover.
