'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Order, OrderStatus } from '@/types';
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Loader2,
} from 'lucide-react';

const STATUS_STEPS: { status: OrderStatus; label: string; description: string }[] = [
  {
    status: 'Pending Verification',
    label: 'Payment Under Review',
    description: 'UPI UTR / Screenshot submitted by customer',
  },
  {
    status: 'Payment Verified',
    label: 'Payment Verified',
    description: 'Confirmed by Royes Creations billing team',
  },
  {
    status: 'Processing',
    label: 'Processing & Curating',
    description: 'Preparing handcrafted items for packaging',
  },
  {
    status: 'Packed',
    label: 'Safely Packed',
    description: 'Artisanal protection wrapping completed',
  },
  {
    status: 'Out for Delivery',
    label: 'Out for Delivery in Jaipur',
    description: 'Dispatched with local Jaipur courier partner',
  },
  {
    status: 'Delivered',
    label: 'Delivered',
    description: 'Handed over directly at your doorstep',
  },
];

export default function TrackOrderClient() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('orderNumber') || '');
  const [mobile, setMobile] = useState(searchParams.get('mobile') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchTracking = async (searchOrderNum: string, searchMobile: string) => {
    if (!searchOrderNum.trim() || !searchMobile.trim()) {
      setErrorMsg('Please enter both your Order ID and Mobile number.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setOrder(null);

    try {
      const res = await fetch(
        `/api/track?orderNumber=${encodeURIComponent(searchOrderNum.trim())}&mobile=${encodeURIComponent(
          searchMobile.trim()
        )}`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'No matching order found.');
      }

      setOrder(data.order);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch order status. Please verify your details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const qOrder = searchParams.get('orderNumber');
    const qMobile = searchParams.get('mobile');
    if (qOrder && qMobile) {
      fetchTracking(qOrder, qMobile);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderNumber, mobile);
  };

  // Determine current timeline progress index
  const getCurrentStepIndex = (currentStatus: string) => {
    if (currentStatus === 'Cancelled') return -1;
    const idx = STATUS_STEPS.findIndex((s) => s.status === currentStatus);
    if (idx !== -1) return idx;
    if (currentStatus === 'Order Confirmed') return 1;
    return 0;
  };

  const currentStepIdx = order ? getCurrentStepIndex(order.order_status) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          Jaipur Priority Logistics
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Track Your Royes Creations Order
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Enter your Order ID and 10-digit mobile number to check real-time verification and dispatch status.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">
              Order ID / Number
            </label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="e.g. RC-2026-12345"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </div>

          <div className="sm:col-span-4 space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">
              Mobile Number
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
              placeholder="10-digit mobile"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-brand-900 hover:bg-brand-800 disabled:bg-stone-400 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all h-[46px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Tracking...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search Order</span>
                </>
              )}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Tracking Result View */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-premium space-y-8 animate-in fade-in duration-300">
          
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
            <div>
              <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider block">
                Order Tracking Record
              </span>
              <h2 className="font-mono text-2xl font-bold text-stone-900 mt-1">
                {order.order_number}
              </h2>
              <span className="text-xs text-stone-500">
                Placed on: {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="flex flex-col sm:items-end gap-1.5">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                Current Status
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold ${
                  order.order_status === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.order_status === 'Cancelled'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {order.order_status}
              </span>
              <span className="text-[11px] text-stone-500">
                Payment: <strong className="text-stone-700">{order.payment_status}</strong>
              </span>
            </div>
          </div>

          {/* Cancellation Notice if Cancelled */}
          {order.order_status === 'Cancelled' && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-1">
              <span className="font-bold block">Order Cancelled</span>
              <p>
                This order was cancelled. If you already transferred via UPI, our support team will contact you or process a refund to your original VPA.
              </p>
            </div>
          )}

          {/* Stepper Timeline */}
          {order.order_status !== 'Cancelled' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Live Timeline
              </h3>
              
              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                {STATUS_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step.status} className="relative flex items-start gap-4">
                      {/* Step Indicator Dot */}
                      <div
                        className={`absolute -left-6 sm:-left-8 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-white border-stone-300 text-transparent'
                        } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}
                      >
                        <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                      </div>

                      {/* Step Content */}
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-xs sm:text-sm font-bold ${
                              isCompleted ? 'text-stone-900' : 'text-stone-400'
                            }`}
                          >
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] bg-brand-100 text-brand-800 font-semibold px-2 py-0.5 rounded-full">
                              Active State
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 leading-normal">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100 text-xs">
            
            {/* Delivery Destination */}
            <div className="space-y-2">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-700" />
                <span>Destination (Jaipur Delivery)</span>
              </span>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1 text-stone-700">
                <p className="font-semibold text-stone-900">{order.customer_name}</p>
                <p>{order.house_flat}, {order.street_area}</p>
                {order.landmark && <p>Landmark: {order.landmark}</p>}
                <p className="font-medium">{order.city}, {order.state} - {order.pincode}</p>
              </div>
            </div>

            {/* Payment & Amount Summary */}
            <div className="space-y-2">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Payment & Verification</span>
              </span>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 text-stone-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Jaipur Delivery Fee</span>
                  {order.delivery_charge === 0 ? (
                    <span className="font-bold text-emerald-700">FREE</span>
                  ) : (
                    <span>₹{order.delivery_charge}</span>
                  )}
                </div>
                <div className="border-t border-stone-200 pt-1 flex justify-between font-bold text-stone-900">
                  <span>Total Amount</span>
                  <span className="font-serif text-brand-900">₹{order.total_amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-[11px] text-stone-500 pt-1">
                  UPI UTR Ref: <code className="font-mono text-stone-800">{order.utr || 'Pending verification'}</code>
                </div>
              </div>
            </div>

          </div>

          {/* Items In this order */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Ordered Products
            </h3>
            <div className="space-y-2">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-stone-50 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-3">
                    {item.product_image_snapshot && (
                      <img
                        src={item.product_image_snapshot}
                        alt={item.product_name_snapshot}
                        className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-stone-900">{item.product_name_snapshot}</h4>
                      <span className="text-stone-500">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">
                    ₹{item.item_total.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
