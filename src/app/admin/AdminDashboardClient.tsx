'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Order, Product, DashboardStats } from '@/types';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  Check,
  ShieldCheck,
  MapPin,
  Settings,
  LogOut,
  RefreshCw,
  Loader2,
  ChevronDown,
  Eye,
  Upload,
} from 'lucide-react';

export default function AdminDashboardClient() {
  const router = useRouter();

  // Navigation & Authentication
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Dashboard Data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Order Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Product Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    price: 0,
    original_price: 0,
    description: '',
    image: '',
    category: 'Home Decor',
    stock: 10,
    active: true,
  });
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productUploadLoading, setProductUploadLoading] = useState(false);

  // Settings Form
  const [settingsForm, setSettingsForm] = useState({
    upi_id: '',
    upi_payee_name: '',
    delivery_fee: '49',
    free_delivery_threshold: '1499',
    support_mobile: '',
    support_email: '',
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Screenshot modal preview
  const [zoomedScreenshot, setZoomedScreenshot] = useState<string | null>(null);

  // 1. Authenticate Admin
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth/me');
        const data = await res.json();
        if (!res.ok || !data.success) {
          router.push('/admin/login');
          return;
        }
        setAdminUser(data.admin);
        loadAllData();
      } catch (e) {
        router.push('/admin/login');
      } finally {
        setIsLoadingAuth(false);
      }
    }
    checkAuth();
  }, [router]);

  // 2. Fetch Data
  const loadAllData = async () => {
    setIsRefreshing(true);
    try {
      // Fetch stats
      const statsRes = await fetch('/api/admin/stats');
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.stats);

      // Fetch orders
      fetchOrders();

      // Fetch products
      const prodRes = await fetch('/api/admin/products');
      const prodData = await prodRes.json();
      if (prodData.success) setProducts(prodData.products);

      // Fetch settings
      const setRes = await fetch('/api/admin/settings');
      const setData = await setRes.json();
      if (setData.success) {
        setSettings(setData.settings);
        setSettingsForm({
          upi_id: setData.settings.upi_id || 'royescreations@upi',
          upi_payee_name: setData.settings.upi_payee_name || 'Royes Creations',
          delivery_fee: setData.settings.delivery_fee || '49',
          free_delivery_threshold: setData.settings.free_delivery_threshold || '1499',
          support_mobile: setData.settings.support_mobile || '',
          support_email: setData.settings.support_email || '',
        });
      }
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchOrders = async () => {
    try {
      let url = `/api/admin/orders?limit=100`;
      if (orderSearch) url += `&search=${encodeURIComponent(orderSearch)}`;
      if (statusFilter) url += `&order_status=${encodeURIComponent(statusFilter)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setTotalOrdersCount(data.total);
      }
    } catch (e) {
      console.error('Failed to fetch orders', e);
    }
  };

  useEffect(() => {
    if (!isLoadingAuth && adminUser) {
      fetchOrders();
    }
  }, [orderSearch, statusFilter]);

  // Order Actions
  const handleVerifyPayment = async (orderId: number) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_status: 'Payment Verified',
          order_status: 'Order Confirmed',
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Update local state
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
        // Refresh stats
        const statsRes = await fetch('/api/admin/stats');
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.stats);
      }
    } catch (e) {
      alert('Failed to verify payment');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch (e) {
      alert('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleSaveAdminNotes = async (orderId: number) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: adminNoteInput }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
        setSelectedOrder(data.order);
        alert('Notes saved successfully');
      }
    } catch (e) {
      alert('Failed to save notes');
    }
  };

  // Product Actions
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      slug: '',
      price: 999,
      original_price: 1299,
      description: '',
      image: '',
      category: 'Home Decor',
      stock: 15,
      active: true,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      slug: prod.slug,
      price: prod.price,
      original_price: prod.original_price || 0,
      description: prod.description,
      image: prod.image,
      category: prod.category || 'Home Decor',
      stock: prod.stock,
      active: Boolean(prod.active),
    });
    setIsProductModalOpen(true);
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProductUploadLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setProductForm((prev) => ({ ...prev, image: data.url }));
      } else {
        alert(data.message || 'Image upload failed');
      }
    } catch (e) {
      alert('Failed to upload product image');
    } finally {
      setProductUploadLoading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProduct(true);

    try {
      if (editingProduct) {
        // Edit existing product
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productForm),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? data.product : p))
          );
          setIsProductModalOpen(false);
        } else {
          alert(data.message || 'Failed to update product');
        }
      } else {
        // Create new product
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productForm),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => [...prev, data.product]);
          setIsProductModalOpen(false);
        } else {
          alert(data.message || 'Failed to create product');
        }
      }
    } catch (e) {
      alert('Error saving product');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.message || 'Failed to delete');
      }
    } catch (e) {
      alert('Error deleting product');
    }
  };

  const handleToggleProductActive = async (prod: Product) => {
    try {
      const updatedActive = !prod.active;
      const res = await fetch(`/api/admin/products/${prod.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: updatedActive }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === prod.id ? data.product : p))
        );
      }
    } catch (e) {
      alert('Failed to toggle status');
    }
  };

  // Settings Action
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      } else {
        alert(data.message || 'Failed to save settings');
      }
    } catch (e) {
      alert('Error saving settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Logout Action
  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    localStorage.removeItem('royes_admin_token');
    router.push('/admin/login');
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-stone-600 text-sm font-semibold">
          <Loader2 className="w-5 h-5 animate-spin text-brand-700" />
          <span>Verifying Merchant Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Admin Header Bar */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-900 text-amber-200 font-serif text-xl font-bold flex items-center justify-center shadow-md">
            RC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Royes Creations Owner Dashboard
              </h1>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Jaipur Store Active
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Logged in as <strong className="text-stone-800">{adminUser?.email}</strong> ({adminUser?.name})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={loadAllData}
            disabled={isRefreshing}
            className="p-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-soft space-y-1">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
              Total Verified Sales
            </span>
            <div className="font-serif text-2xl font-bold text-brand-900">
              ₹{stats.totalSales.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-stone-500">Confirmed revenue</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-soft space-y-1">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
              Total Orders
            </span>
            <div className="font-serif text-2xl font-bold text-stone-900">
              {stats.totalOrders}
            </div>
            <span className="text-[10px] text-stone-500">Across Jaipur</span>
          </div>

          {/* Pending verification alert */}
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 shadow-soft space-y-1">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-700" /> Pending UTR Verification
            </span>
            <div className="font-serif text-2xl font-bold text-amber-950">
              {stats.pendingVerificationCount}
            </div>
            <span className="text-[10px] text-amber-700 font-medium">Requires payment check</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-soft space-y-1">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
              Out for Delivery
            </span>
            <div className="font-serif text-2xl font-bold text-stone-900">
              {stats.outForDeliveryCount}
            </div>
            <span className="text-[10px] text-stone-500">In transit</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-soft space-y-1 col-span-2 lg:col-span-1">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
              Active Catalog
            </span>
            <div className="font-serif text-2xl font-bold text-stone-900">
              {stats.totalProducts}
            </div>
            <span className="text-[10px] text-stone-500">Live products</span>
          </div>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-brand-900 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders Management ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-brand-900 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Product Catalogue ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-brand-900 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>UPI & Delivery Settings</span>
        </button>
      </div>

      {/* ================= TAB 1: ORDERS MANAGEMENT ================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-soft flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search by Order ID, Mobile, Name, or UTR..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-brand-700 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs text-stone-500 font-medium whitespace-nowrap">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium bg-white focus:ring-2 focus:ring-brand-700"
                >
                  <option value="">All Orders</option>
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Payment Verified">Payment Verified</option>
                  <option value="Order Confirmed">Order Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold text-[11px] tracking-wider">
                  <tr>
                    <th className="py-4 px-5">Order ID</th>
                    <th className="py-4 px-5">Customer & Area</th>
                    <th className="py-4 px-5">Amount</th>
                    <th className="py-4 px-5">Payment / UTR</th>
                    <th className="py-4 px-5">Order Status</th>
                    <th className="py-4 px-5">Date</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-stone-500">
                        No orders found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-4 px-5 font-mono font-bold text-stone-900">
                          {ord.order_number}
                        </td>
                        <td className="py-4 px-5">
                          <div className="font-semibold text-stone-900">{ord.customer_name}</div>
                          <div className="text-stone-500 text-[11px]">
                            +91 {ord.mobile} • PIN {ord.pincode}
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <div className="font-bold text-stone-900">
                            ₹{ord.total_amount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-stone-400">
                            Delivery: {ord.delivery_charge === 0 ? 'FREE' : `₹${ord.delivery_charge}`}
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.payment_status === 'Payment Verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.payment_status}
                          </span>
                          <div className="font-mono text-[11px] text-stone-500 mt-0.5">
                            UTR: {ord.utr || 'None'}
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <select
                            value={ord.order_status}
                            disabled={updatingOrderId === ord.id}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="px-2.5 py-1 rounded-lg border border-stone-200 text-xs font-semibold bg-white focus:ring-1 focus:ring-brand-700"
                          >
                            <option value="Pending Verification">Pending Verification</option>
                            <option value="Payment Verified">Payment Verified</option>
                            <option value="Order Confirmed">Order Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Packed">Packed</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 px-5 text-stone-500 text-[11px] whitespace-nowrap">
                          {new Date(ord.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>
                        <td className="py-4 px-5 text-right space-x-2 whitespace-nowrap">
                          {ord.payment_status === 'Pending Verification' && (
                            <button
                              onClick={() => handleVerifyPayment(ord.id)}
                              disabled={updatingOrderId === ord.id}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition-colors shadow-2xs"
                              title="Verify Payment in 1-click"
                            >
                              Verify
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedOrder(ord);
                              setAdminNoteInput(ord.admin_notes || '');
                            }}
                            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-semibold text-[11px] transition-colors"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PRODUCT MANAGEMENT ================= */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Product Inventory ({products.length})
              </h2>
              <p className="text-xs text-stone-500">
                Add new items, update prices, manage stock, and toggle storefront visibility.
              </p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2.5 bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-soft overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="py-4 px-5">Product</th>
                  <th className="py-4 px-5">Category</th>
                  <th className="py-4 px-5">Price / MRP</th>
                  <th className="py-4 px-5">Stock</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-stone-900">{prod.name}</div>
                          <div className="text-[11px] text-stone-400 font-mono">/{prod.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-stone-600 font-medium">{prod.category}</td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-stone-900">₹{prod.price.toLocaleString('en-IN')}</div>
                      {prod.original_price && (
                        <div className="text-[10px] text-stone-400 line-through">
                          ₹{prod.original_price.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`font-semibold ${prod.stock < 5 ? 'text-rose-600' : 'text-stone-700'}`}>
                        {prod.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <button
                        onClick={() => handleToggleProductActive(prod)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                          prod.active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                        }`}
                      >
                        {prod.active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        className="p-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: SETTINGS ================= */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft space-y-6">
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Payment & Jaipur Delivery Rules Configuration
              </h2>
              <p className="text-xs text-stone-500">
                Update payment parameters and delivery rules without altering any source code.
              </p>
            </div>

            {settingsSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Settings updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Official UPI ID (VPA)</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.upi_id}
                    onChange={(e) => setSettingsForm({ ...settingsForm, upi_id: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">UPI Payee Business Name</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.upi_payee_name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, upi_payee_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Standard Delivery Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={settingsForm.delivery_fee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, delivery_fee: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-brand-700 focus:outline-none font-bold"
                  />
                  <span className="text-[10px] text-stone-400">Charged when subtotal ≤ ₹1499</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Free Delivery Threshold (₹)</label>
                  <input
                    type="number"
                    required
                    value={settingsForm.free_delivery_threshold}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, free_delivery_threshold: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-brand-700 focus:outline-none font-bold"
                  />
                  <span className="text-[10px] text-stone-400">Orders above this get free delivery (₹1499)</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Support Mobile</label>
                  <input
                    type="text"
                    value={settingsForm.support_mobile}
                    onChange={(e) => setSettingsForm({ ...settingsForm, support_mobile: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Support Email</label>
                  <input
                    type="email"
                    value={settingsForm.support_email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, support_email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-6 py-3 bg-brand-900 hover:bg-brand-800 disabled:bg-stone-400 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-colors"
                >
                  {isSavingSettings ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Settings</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ORDER INSPECTION DRAWER / MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                  Inspect Order
                </span>
                <h3 className="font-mono text-xl font-bold text-stone-900">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-600">Payment:</span>
                <span
                  className={`px-3 py-1 rounded-full font-bold ${
                    selectedOrder.payment_status === 'Payment Verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedOrder.payment_status}
                </span>
              </div>

              {selectedOrder.payment_status !== 'Payment Verified' && (
                <button
                  onClick={() => handleVerifyPayment(selectedOrder.id)}
                  disabled={updatingOrderId === selectedOrder.id}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Verify Payment Now</span>
                </button>
              )}
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-800 block">Customer Information</span>
                <p className="font-semibold text-stone-900">{selectedOrder.customer_name}</p>
                <p className="text-stone-600">Mobile: +91 {selectedOrder.mobile}</p>
                {selectedOrder.email && <p className="text-stone-600">Email: {selectedOrder.email}</p>}
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-800 block">Jaipur Delivery Destination</span>
                <p className="text-stone-700">{selectedOrder.house_flat}, {selectedOrder.street_area}</p>
                {selectedOrder.landmark && <p className="text-stone-500">Landmark: {selectedOrder.landmark}</p>}
                <p className="font-semibold text-stone-900">{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
              </div>
            </div>

            {/* Payment & UTR Proof */}
            <div className="p-4 bg-brand-50/70 rounded-xl border border-brand-100 text-xs space-y-3">
              <span className="font-bold text-brand-900 block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-700" />
                <span>Submitted UPI Verification Data</span>
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-stone-500">UTR / Reference ID: </span>
                  <code className="font-mono font-bold text-sm text-stone-900 bg-white px-2 py-0.5 rounded border border-brand-200">
                    {selectedOrder.utr || 'Not Entered'}
                  </code>
                </div>

                {selectedOrder.payment_screenshot && (
                  <button
                    onClick={() => setZoomedScreenshot(selectedOrder.payment_screenshot!)}
                    className="px-3 py-1.5 bg-white hover:bg-stone-100 text-brand-900 border border-brand-300 rounded-lg font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                  >
                    <Eye className="w-3.5 h-3.5 text-brand-700" />
                    <span>View Uploaded Screenshot</span>
                  </button>
                )}
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-stone-800 block">Ordered Items</span>
              <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 overflow-hidden">
                {selectedOrder.items?.map((it) => (
                  <div key={it.id} className="p-3 flex items-center justify-between bg-stone-50/50">
                    <div className="flex items-center gap-2.5">
                      {it.product_image_snapshot && (
                        <img
                          src={it.product_image_snapshot}
                          alt={it.product_name_snapshot}
                          className="w-9 h-9 rounded-lg object-cover border border-stone-200"
                        />
                      )}
                      <div>
                        <div className="font-semibold text-stone-900">{it.product_name_snapshot}</div>
                        <div className="text-stone-400 text-[10px]">Qty: {it.quantity}</div>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900">
                      ₹{it.item_total.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between font-bold text-stone-900">
                <span>Total Payable (incl. Jaipur delivery)</span>
                <span className="font-serif text-sm text-brand-900">
                  ₹{selectedOrder.total_amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-stone-800 block">Merchant Admin Notes</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="e.g. Verified with HDFC UPI app, scheduled delivery for 4 PM..."
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-brand-700 focus:outline-none"
                />
                <button
                  onClick={() => handleSaveAdminNotes(selectedOrder.id)}
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PRODUCT ADD / EDIT MODAL ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setIsProductModalOpen(false)}
          />

          <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingProduct ? 'Edit Product' : 'Add New Handcrafted Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Product Name</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Royal Blue Pottery Serving Platter"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-brand-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Original MRP (₹)</label>
                  <input
                    type="number"
                    value={productForm.original_price}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        original_price: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  >
                    <option value="Home Decor">Home Decor</option>
                    <option value="Spiritual & Fragrance">Spiritual & Fragrance</option>
                    <option value="Table Linen">Table Linen</option>
                    <option value="Festive & Decor">Festive & Decor</option>
                    <option value="Aromatherapy">Aromatherapy</option>
                    <option value="Pottery & Ceramics">Pottery & Ceramics</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-700">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Product Image URL or File Upload */}
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Product Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... or upload"
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  />
                  <label className="cursor-pointer px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold flex items-center gap-1 shrink-0 border border-stone-300">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{productUploadLoading ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {productForm.image && (
                  <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-stone-200">
                    <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-700">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe craftsmanship, materials, dimensions, and styling notes..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-brand-700 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="prod-active"
                  checked={productForm.active}
                  onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                  className="rounded text-brand-900 focus:ring-brand-700"
                />
                <label htmlFor="prod-active" className="font-semibold text-stone-700 cursor-pointer">
                  Display and enable on storefront
                </label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-6 py-2.5 bg-brand-900 hover:bg-brand-800 disabled:bg-stone-400 text-white font-semibold rounded-xl flex items-center gap-2 shadow-sm"
                >
                  {isSavingProduct ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= PAYMENT SCREENSHOT ZOOM MODAL ================= */}
      {zoomedScreenshot && (
        <div className="fixed inset-0 z-60 overflow-hidden flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-950/80 backdrop-blur-md"
            onClick={() => setZoomedScreenshot(null)}
          />
          <div className="relative max-w-xl max-h-[90vh] bg-white rounded-3xl p-4 shadow-2xl z-10 flex flex-col items-center">
            <button
              onClick={() => setZoomedScreenshot(null)}
              className="absolute top-4 right-4 p-2 bg-stone-900/80 text-white rounded-full hover:bg-stone-900"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomedScreenshot}
              alt="UPI Payment Screenshot"
              className="max-h-[80vh] w-auto object-contain rounded-2xl"
            />
            <span className="text-xs text-stone-500 pt-2 font-mono">
              Customer Payment Receipt
            </span>
          </div>
        </div>
      )}

    </div>
  );
}
