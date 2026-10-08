import React from 'react';
import { getProducts } from '@/lib/db';
import ProductCatalogClient from './ProductCatalogClient';
import { MapPin, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default function ShopPage() {
  const products = getProducts({ onlyActive: true });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-800 text-amber-300 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Jaipur Exclusive Collection</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Artisanal Catalogue
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Direct from Jaipur master craftsmen. Enjoy flat ₹49 delivery or <strong>FREE delivery on orders over ₹1499</strong>.
          </p>
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-brand-700/20 pointer-events-none blur-3xl" />
      </div>

      {/* Interactive Catalog with Search, Categories, and Sorting */}
      <ProductCatalogClient initialProducts={products} />

    </div>
  );
}
