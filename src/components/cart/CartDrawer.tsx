'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    deliveryCharge,
    total,
    amountNeededForFreeDelivery,
    isFreeDelivery,
    isDrawerOpen,
    setIsDrawerOpen,
  } = useCart();

  if (!isDrawerOpen) return null;

  // Calculate percentage toward free delivery (₹1500 threshold)
  const progressPercent = Math.min(100, Math.round((subtotal / 1500) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden transition-opacity">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-700" />
              <h2 className="font-serif text-lg font-bold text-stone-900">Your Shopping Bag</h2>
              <span className="text-xs bg-brand-100 text-brand-800 font-semibold px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar Progress */}
          {items.length > 0 && (
            <div className="px-6 py-3.5 bg-brand-50/70 border-b border-brand-100/80">
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                {isFreeDelivery ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    You’ve unlocked FREE delivery in Jaipur!
                  </span>
                ) : (
                  <span className="text-brand-900">
                    Add <strong className="text-brand-700 font-bold">₹{amountNeededForFreeDelivery}</strong> more to get <strong className="text-emerald-700">FREE delivery</strong>
                  </span>
                )}
                <span className="text-[11px] text-stone-500 font-semibold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isFreeDelivery ? 'bg-emerald-600' : 'bg-brand-600'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-semibold text-stone-800">Your bag is empty</h3>
                  <p className="text-xs text-stone-500 max-w-xs">
                    Explore handcrafted Royes Creations artisanal pieces ready for priority delivery in Jaipur.
                  </p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="mt-2 inline-flex items-center justify-center px-6 py-2.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                >
                  <Link href="/shop">Browse Catalog</Link>
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-stone-50/70 hover:bg-stone-50 rounded-xl border border-stone-200/80 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-stone-200 shrink-0 border border-stone-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-medium text-stone-900 line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="text-stone-400 hover:text-rose-600 p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-xs text-stone-500 font-medium">
                        ₹{product.price.toLocaleString('en-IN')} each
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 px-2 text-stone-600 hover:bg-stone-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-stone-800 min-w-6 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 px-2 text-stone-600 hover:bg-stone-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-stone-900">
                          ₹{(product.price * quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="border-t border-stone-200 px-6 py-5 bg-stone-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-800">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-stone-600 items-center">
                  <span className="flex items-center gap-1">
                    Delivery Charge (Jaipur)
                  </span>
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">
                      FREE
                    </span>
                  ) : (
                    <span className="font-semibold text-stone-800">₹{deliveryCharge}</span>
                  )}
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between text-stone-900 text-sm">
                  <span className="font-semibold">Total Payable</span>
                  <span className="font-bold font-serif text-base text-brand-900">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full py-3.5 bg-brand-900 hover:bg-brand-800 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <span>Proceed to Jaipur Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="text-[11px] text-center text-stone-500 flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3 text-brand-600" />
                Delivering exclusively in Jaipur • 100% Prepaid UPI
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
