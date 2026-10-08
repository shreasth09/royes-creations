export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number | null;
  image: string;
  images?: string[] | string | null;
  category: string;
  specifications?: Record<string, string> | string | null;
  stock: number;
  active: number | boolean;
  is_featured: number | boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  product_name_snapshot: string;
  product_image_snapshot?: string | null;
  price_snapshot: number;
  quantity: number;
  item_total: number;
}

export type OrderStatus =
  | 'Pending Verification'
  | 'Payment Verified'
  | 'Order Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus = 'Pending Verification' | 'Payment Verified' | 'Failed';

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  mobile: string;
  email?: string | null;
  house_flat: string;
  street_area: string;
  landmark?: string | null;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  delivery_charge: number;
  total_amount: number;
  payment_method: string;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  utr?: string | null;
  payment_screenshot?: string | null;
  notes?: string | null;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface JaipurValidationResult {
  isValid: boolean;
  message?: string;
  areaName?: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalSales: number;
  pendingVerificationCount: number;
  outForDeliveryCount: number;
  deliveredCount: number;
  cancelledCount: number;
  totalProducts: number;
  recentOrders: Order[];
}
