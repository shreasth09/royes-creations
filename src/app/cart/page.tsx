'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  MapPin,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryCharge,
    total,
    amountNeededForFreeDelivery,
    isFreeDelivery,
  } = useCart();

  const progressPercent = Math.min(100, Math.round((subtotal / 1500) * 100));

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center text-brand-700 mx-auto">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-stone-900">Your Bag is Empty</h1>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            You don't have any Royes Creations items in your cart yet. Explore our handcrafted collection available for priority Jaipur delivery.
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md"
        >
          <span>Explore Shop</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-2">
            <ChevronLeft className="w-4 h-4" /> Back to Shop
          </Link>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Shopping Bag ({items.length})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-stone-500 hover:text-rose-600 transition-colors self-start sm:self-auto"
        >
          Clear Entire Bag
        </button>
      </div>

      {/* Free Delivery Banner */}
      <div className="bg-brand-50/80 rounded-2xl p-4 sm:p-5 border border-brand-100 space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
          {isFreeDelivery ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              You’ve unlocked <strong>FREE Delivery</strong> across Jaipur!
            </span>
          ) : (
            <span className="text-brand-900">
              Add <strong className="text-brand-700 font-bold">₹{amountNeededForFreeDelivery}</strong> more to get <strong className="text-emerald-700">FREE delivery</strong>
            </span>
          )}
          <span className="text-xs text-stone-500 font-semibold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isFreeDelivery ? 'bg-emerald-600' : 'bg-brand-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Cart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-soft flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
            >
              <div className="flex gap-4 items-center flex-1">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <Link href={`/product/${product.slug}`} className="hover:text-brand-700 transition-colors">
                    <h3 className="font-serif text-base font-bold text-stone-900 line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-stone-500">
                    Category: {product.category || 'Handcrafted'}
                  </p>
                  <span className="text-sm font-semibold text-stone-900 sm:hidden block">
                    ₹{product.price.toLocaleString('en-IN')} each
                  </span>
                </div>
              </div>

              {/* Quantity Stepper & Price */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-stone-100">
                <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="p-1.5 px-3 text-stone-600 hover:bg-stone-100 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-stone-800 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="p-1.5 px-3 text-stone-600 hover:bg-stone-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-24">
                  <span className="font-serif text-base font-bold text-stone-900 block">
                    ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    ₹{product.price.toLocaleString('en-IN')} × {quantity}
                  </span>
                </div>

                <button
                  onClick={() => removeItem(product.id)}
                  className="text-stone-400 hover:text-rose-600 p-2 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-premium space-y-6">
          <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-200 pb-4">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Cart Subtotal</span>
              <span className="font-semibold text-stone-900">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between text-stone-600 items-center">
              <div>
                <span>Delivery Charge</span>
                <span className="block text-[11px] text-stone-400">Jaipur Delivery Network</span>
              </div>
              {deliveryCharge === 0 ? (
                <span className="text-emerald-700 font-bold uppercase tracking-wider text-xs">
                  FREE
                </span>
              ) : (
                <span className="font-semibold text-stone-900">₹{deliveryCharge}</span>
              )}
            </div>

            <div className="border-t border-stone-200 pt-4 flex justify-between text-base">
              <span className="font-semibold text-stone-900">Total Payable</span>
              <span className="font-serif font-extrabold text-xl text-brand-900">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/checkout"
              className="w-full py-4 bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs text-stone-600 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-brand-900">
                <MapPin className="w-3.5 h-3.5 text-brand-700" />
                <span>Jaipur Delivery Policy Enforced</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-normal">
                Subtotal &gt; ₹1499 gets free shipping. Subtotal ≤ ₹1499 charges flat ₹49.
              </p>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-4 text-xs text-stone-500 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Secure Prepaid UPI (No COD)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
