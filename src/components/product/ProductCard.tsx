'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const router = useRouter();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    router.push('/checkout');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
  };

  const discountPercent =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null;

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-soft hover:shadow-premium transition-all duration-300 flex flex-col h-full">
      {/* Image Container with Badges */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="bg-stone-900/80 backdrop-blur-md text-amber-200 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
            {product.category || 'Handcrafted'}
          </span>
          {discountPercent && (
            <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Jaipur Delivery Badge */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="w-full text-center block bg-white/95 backdrop-blur-md text-brand-900 text-[11px] font-medium py-1.5 px-2 rounded-lg shadow-sm border border-stone-200/80">
            Jaipur Priority Delivery
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link href={`/product/${product.slug}`} className="block group-hover:text-brand-700 transition-colors">
            <h3 className="font-serif text-base font-bold text-stone-900 line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Actions */}
        <div className="space-y-3 pt-2 border-t border-stone-100">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg font-bold text-stone-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.original_price && (
              <span className="text-xs text-stone-400 line-through">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-[11px] text-stone-500 ml-auto font-medium">
              Incl. taxes
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-stone-200"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-2.5 px-3 bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors shadow-xs"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
