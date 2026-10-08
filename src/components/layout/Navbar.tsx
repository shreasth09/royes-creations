'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Search, Shield, MapPin, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItemsCount, setIsDrawerOpen } = useCart();
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Our Story', href: '/#about' },
    { label: 'Delivery Policy', href: '/#delivery' },
    { label: 'Track Order', href: '/track' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo / Monogram */}
          <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start">
            <Link href="/" className="flex items-center gap-3 group text-left">
              <div className="w-10 h-10 rounded-full bg-brand-900 text-amber-200 flex items-center justify-center font-serif text-xl font-bold tracking-widest shadow-soft group-hover:bg-brand-800 transition-all">
                RC
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 group-hover:text-brand-700 transition-colors">
                  Royes Creations
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-brand-600">
                  Jaipur • Artisanal D2C
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? 'text-brand-700 font-semibold'
                      : 'text-stone-700 hover:text-brand-600'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons: Track Order & Cart */}
          <div className="flex items-center gap-3">
            <Link
              href="/track"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors border border-stone-200"
            >
              <Search className="w-3.5 h-3.5 text-stone-500" />
              <span>Track Order</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 rounded-full text-stone-800 hover:bg-stone-100 transition-all focus:outline-none flex items-center gap-2"
              aria-label="Open Shopping Bag"
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6 text-stone-800" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-brand-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline-block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Bag
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-stone-50/98 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between py-2 border-b border-stone-200 text-xs text-stone-600">
            <span className="flex items-center gap-1.5 font-medium text-brand-700">
              <MapPin className="w-3.5 h-3.5" /> Delivering exclusively in Jaipur
            </span>
            <span className="font-semibold text-emerald-700">Free delivery &gt; ₹1499</span>
          </div>

          <div className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-base font-medium text-stone-800 hover:bg-white hover:text-brand-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1.5 pt-4 border-t border-stone-200"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
