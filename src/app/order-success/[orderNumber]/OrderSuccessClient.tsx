'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Order } from '@/types';
import {
  CheckCircle2,
  Copy,
  Check,
  Clock,
  MapPin,
  ShieldCheck,
  Package,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface Props {
  order: Order;
}

export default function OrderSuccessClient({ order }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.order_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Success Hero Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-12 h-12 stroke-[2]" />
        </div>
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest font-bold text-brand-700">
            Payment & Order Submitted
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900">
            Order Placed Successfully!
          </h1>
          <p className="text-sm text-stone-600 max-w-lg mx-auto">
            Thank you, <strong>{order.customer_name}</strong>. Your order is registered in our Jaipur fulfillment system.
          </p>
        </div>
      </div>

      {/* Order ID & Status Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <div className="space-y-1">
            <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">
              Order Reference ID
            </span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl sm:text-2xl font-black text-brand-900">
                {order.order_number}
              </span>
              <button
                onClick={handleCopyOrderNumber}
                className="p-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy ID'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:items-end space-y-1">
            <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">
              Verification Status
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              {order.payment_status}
            </span>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Fulfillment Journey (Jaipur Exclusive)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl space-y-1">
              <span className="font-bold text-brand-900 block">1. Payment Pending</span>
              <p className="text-stone-500 text-[11px]">UTR submitted ({order.utr || 'Pending'})</p>
            </div>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1 opacity-70">
              <span className="font-semibold text-stone-700 block">2. Payment Verified</span>
              <p className="text-stone-400 text-[11px]">Admin review</p>
            </div>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1 opacity-70">
              <span className="font-semibold text-stone-700 block">3. Packed</span>
              <p className="text-stone-400 text-[11px]">Artisanal packaging</p>
            </div>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1 opacity-70">
              <span className="font-semibold text-stone-700 block">4. Jaipur Delivery</span>
              <p className="text-stone-400 text-[11px]">Doorstep handover</p>
            </div>
          </div>
        </div>

        {/* Order Details & Delivery Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
          
          {/* Delivery Address */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-stone-900">
              <MapPin className="w-4 h-4 text-brand-700" />
              <span>Delivery Address (Jaipur)</span>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1 text-stone-700 leading-relaxed">
              <p className="font-semibold text-stone-900">{order.customer_name}</p>
              <p>{order.house_flat}, {order.street_area}</p>
              {order.landmark && <p>Landmark: {order.landmark}</p>}
              <p className="font-medium">{order.city}, {order.state} - {order.pincode}</p>
              <p className="text-stone-500 pt-1">Mobile: +91 {order.mobile}</p>
            </div>
          </div>

          {/* Payment & Charges Breakdown */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-stone-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Payment Breakdown</span>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-stone-700">
              <div className="flex justify-between">
                <span>Subtotal ({order.items?.length || 0} items)</span>
                <span className="font-semibold">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Jaipur Delivery Fee</span>
                {order.delivery_charge === 0 ? (
                  <span className="font-bold text-emerald-700">FREE</span>
                ) : (
                  <span className="font-semibold">₹{order.delivery_charge}</span>
                )}
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-stone-900 text-sm">
                <span>Total Amount</span>
                <span className="font-serif text-brand-900">₹{order.total_amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-1 text-[11px] text-stone-500">
                Payment Method: Prepaid UPI (UTR: <code className="font-mono text-stone-800">{order.utr || 'Under Review'}</code>)
              </div>
            </div>
          </div>

        </div>

        {/* Ordered Items Table */}
        <div className="space-y-3 pt-4 border-t border-stone-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Ordered Items
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
                    <span className="text-stone-500">Quantity: {item.quantity}</span>
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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href={`/track?orderNumber=${order.order_number}&mobile=${order.mobile}`}
          className="w-full sm:w-auto px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <span>Track Order Status Live</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/shop"
          className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-stone-200 transition-colors"
        >
          <span>Continue Shopping</span>
        </Link>
      </div>

    </div>
  );
}
