'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, ShieldCheck, Heart, Sparkles, Phone, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Founders */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-700 text-amber-200 flex items-center justify-center font-serif text-lg font-bold">
                RC
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Royes Creations
              </span>
            </div>
            
            <p className="text-stone-400 text-sm leading-relaxed">
              Thoughtfully curated artisanal creations, home essentials, and timeless decor. Originally serving customers on Meesho, Amazon, and Flipkart — now bringing direct-to-home craftsmanship to Jaipur.
            </p>

            <div className="pt-2 border-t border-stone-800 text-xs text-stone-400">
              <span className="text-amber-400/90 font-medium block mb-1">Founders & Curators</span>
              <p className="text-stone-300 font-semibold tracking-wide">
                Shreasth Chaturvedi & Samiksha Chaturvedi
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">
              Explore Catalog
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-300 transition-colors">
                  Home Collection
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-amber-300 transition-colors">
                  All Artisanal Products
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  Track Your Order <ArrowUpRight className="w-3.5 h-3.5 text-stone-500" />
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-stone-500 hover:text-stone-300 transition-colors text-xs flex items-center gap-1 pt-2">
                  Merchant Admin Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Jaipur Exclusive Policy */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">
              Jaipur Delivery & Rules
            </h4>
            <div className="bg-stone-800/80 rounded-xl p-4 border border-stone-700/60 space-y-3 text-xs leading-relaxed">
              <div className="flex items-start gap-2 text-stone-200">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Jaipur Only:</strong> Royes Creations exclusively serves Jaipur delivery addresses. Non-Jaipur orders are strictly restricted.
                </span>
              </div>
              <div className="flex items-start gap-2 text-stone-200">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Delivery Charges:</strong> ₹49 on orders ₹1499 & below. Orders above ₹1499 get <strong>FREE delivery</strong>.
                </span>
              </div>
              <div className="flex items-start gap-2 text-stone-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Prepaid Only:</strong> 100% secure UPI & QR payment. Cash on Delivery (COD) is not accepted.
                </span>
              </div>
            </div>
          </div>

          {/* Column 4: Contact & Support */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">
              Customer Support
            </h4>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400" />
                <a href="mailto:contact@royescreations.com" className="hover:text-white transition-colors">
                  contact@royescreations.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+91 98290 12345 (Jaipur HQ)</span>
              </div>
              <div className="pt-2 text-xs text-stone-500 leading-normal">
                Dedicated support for Jaipur customers: Monday – Saturday (10:00 AM – 7:00 PM IST).
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-1 text-center sm:text-left">
            <span>© {new Date().getFullYear()} Royes Creations. Crafted with care in Jaipur, Rajasthan, India.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-300 cursor-pointer">Return & Verification Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
