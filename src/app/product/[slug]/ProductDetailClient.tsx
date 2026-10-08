'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/lib/cart-context';
import ProductCard from '@/components/product/ProductCard';
import PincodeChecker from '@/components/product/PincodeChecker';
import {
  ShoppingBag,
  ArrowRight,
  Plus,
  Minus,
  CheckCircle2,
  MapPin,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
} from 'lucide-react';

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Gallery image setup
  const galleryImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image];

  const [activeImage, setActiveImage] = useState(galleryImages[0]);

  const discountPercent =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null;

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/checkout');
  };

  const specs =
    typeof product.specifications === 'object' && product.specifications !== null
      ? (product.specifications as Record<string, string>)
      : {};

  return (
    <div className="space-y-16">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/" className="hover:text-stone-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-stone-900 transition-colors">
          Catalog
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-stone-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-soft">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {discountPercent && (
              <span className="absolute top-4 left-4 bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImage === img
                      ? 'border-brand-800 scale-95 shadow-sm'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Box & Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              {product.category || 'Handcrafted Art'}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="font-serif text-3xl font-extrabold text-stone-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.original_price && (
              <span className="text-sm text-stone-400 line-through">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs text-stone-500 font-medium ml-auto">
              Inclusive of all taxes
            </span>
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2 text-xs">
            {product.stock > 0 ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                In Stock ({product.stock} units ready for dispatch in Jaipur)
              </span>
            ) : (
              <span className="text-rose-600 font-semibold">Currently Out of Stock</span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2 text-sm text-stone-600 leading-relaxed border-t border-stone-200 pt-4">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Product Overview</h3>
            <p>{product.description}</p>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-stone-700">Quantity:</span>
              <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 px-3 text-stone-600 hover:bg-stone-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-sm font-bold text-stone-900 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 px-3 text-stone-600 hover:bg-stone-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors border border-stone-300"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-4 bg-brand-900 hover:bg-brand-800 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Jaipur Delivery Policy Box */}
          <div className="bg-brand-50/60 rounded-2xl p-5 border border-brand-100 space-y-3">
            <div className="flex items-center gap-2 text-brand-900 font-semibold text-xs">
              <MapPin className="w-4 h-4 text-brand-700 shrink-0" />
              <span>Jaipur Exclusive Delivery Terms</span>
            </div>
            
            <ul className="space-y-2 text-xs text-stone-600">
              <li className="flex items-start gap-2">
                <Truck className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span>
                  Delivery Charge: ₹49 (Orders ≤ ₹1499) | <strong>FREE Delivery</strong> on orders above ₹1499.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Prepaid UPI Only (GPay, PhonePe, Paytm, BHIM). No Cash on Delivery.
                </span>
              </li>
            </ul>

            <div className="pt-2 border-t border-brand-200/60">
              <PincodeChecker />
            </div>
          </div>

          {/* Specifications Table */}
          {Object.keys(specs).length > 0 && (
            <div className="space-y-3 border-t border-stone-200 pt-6">
              <h3 className="font-serif font-bold text-stone-900 text-sm">Product Specifications</h3>
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden text-xs">
                {Object.entries(specs).map(([key, val], idx) => (
                  <div
                    key={key}
                    className={`flex justify-between p-3 ${
                      idx % 2 === 0 ? 'bg-stone-50/50' : 'bg-white'
                    }`}
                  >
                    <span className="font-medium text-stone-500">{key}</span>
                    <span className="font-semibold text-stone-800 text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-stone-200">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              More Creations You Might Like
            </h2>
            <Link href="/shop" className="text-xs font-semibold text-brand-700 hover:text-brand-900">
              Browse All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
