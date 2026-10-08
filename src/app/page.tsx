import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/db';
import ProductCard from '@/components/product/ProductCard';
import PincodeChecker from '@/components/product/PincodeChecker';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  Heart,
  Award,
  Package,
} from 'lucide-react';

export const revalidate = 0; // Dynamic server rendering

export default function HomePage() {
  const products = getProducts({ onlyActive: true, limit: 5 });

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-b border-stone-200/60 bg-gradient-to-b from-[#F7F2EB] to-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-200/80 shadow-xs text-xs font-semibold text-brand-900">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Exclusive Jaipur Direct Delivery</span>
                <span className="text-stone-300">•</span>
                <span className="text-brand-600 font-bold">Free Over ₹1499</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
                Thoughtfully Chosen. <br />
                <span className="text-brand-700 italic font-normal">
                  Beautifully Delivered.
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Welcome to <strong>Royes Creations</strong>. Trusted on top Indian marketplaces, now delivering our handcrafted Jaipur pottery, brassware, and artisanal decor directly to your doorstep.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-8 py-4 bg-brand-900 hover:bg-brand-800 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all"
                >
                  <span>Explore 5 Flagship Creations</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#delivery"
                  className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 border border-stone-200 shadow-2xs transition-colors"
                >
                  <MapPin className="w-4 h-4 text-brand-700" />
                  <span>Check Jaipur Delivery</span>
                </a>
              </div>

              {/* Highlights pills */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-200/80 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <span className="block font-serif text-xl font-bold text-stone-900">100%</span>
                  <span className="text-xs text-stone-500 font-medium">Prepaid UPI Security</span>
                </div>
                <div className="text-center lg:text-left border-x border-stone-200/80 px-2">
                  <span className="block font-serif text-xl font-bold text-stone-900">₹0</span>
                  <span className="text-xs text-stone-500 font-medium">Delivery &gt; ₹1499</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="block font-serif text-xl font-bold text-stone-900">Jaipur</span>
                  <span className="text-xs text-stone-500 font-medium">Priority Dispatch</span>
                </div>
              </div>
            </div>

            {/* Right Product Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-200">
                  <img
                    src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80"
                    alt="Royes Creations Blue Pottery Vase"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
                  
                  {/* Floating badge */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/40 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-600 block">
                        Featured Highlight
                      </span>
                      <h4 className="font-serif text-sm font-bold text-stone-900">
                        Handcrafted Blue Pottery Ceramic Vase
                      </h4>
                      <span className="text-xs text-stone-600 font-medium">
                        ₹1,199 • In Stock
                      </span>
                    </div>
                    <Link
                      href="/product/handcrafted-blue-pottery-ceramic-vase"
                      className="p-2.5 bg-brand-900 text-white rounded-xl hover:bg-brand-800 transition-colors shrink-0 ml-3"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Decorative Accent Card */}
                <div className="hidden sm:flex absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-xl border border-stone-100 items-center gap-3 animate-bounce duration-1000">
                  <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                    ✨
                  </div>
                  <div className="text-xs">
                    <span className="block font-bold text-stone-900">Authentic Craft</span>
                    <span className="text-stone-500">Made by Jaipur Masters</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHY ROYES CREATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
            The Direct-to-Customer Difference
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Why Choose Royes Creations?
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            After serving thousands of customers across marketplace platforms, we are proud to offer an elevated, direct shopping experience built exclusively for our hometown.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft hover:shadow-premium transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-100/70 text-brand-800 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Carefully Selected</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every creation is personally vetted for material integrity, aesthetic balance, and enduring artisan value.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft hover:shadow-premium transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Jaipur-First Priority</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Exclusively dedicated to Jaipur deliveries for safer transit, quicker handling, and personalized service.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft hover:shadow-premium transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Secure Prepaid UPI</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Zero hassle QR payments via Google Pay, PhonePe, Paytm, or BHIM with manual UTR & screenshot verification.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft hover:shadow-premium transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100/70 text-purple-800 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">Marketplace Heritage</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Experienced sellers on Meesho, Amazon, and Flipkart bringing factory-direct value without marketplace markups.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              Handpicked Launch Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
              Featured Creations
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900 transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 5 Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. BRAND STORY & FOUNDERS */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-12 lg:p-16 shadow-premium">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-900 text-xs font-semibold">
                <Heart className="w-3.5 h-3.5 text-brand-700" />
                <span>Our Roots & Story</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                Crafting Aesthetic Homes, One Creation at a Time.
              </h2>

              <div className="space-y-4 text-stone-600 text-sm leading-relaxed">
                <p>
                  <strong>Royes Creations</strong> was born out of a genuine passion for authentic Indian craftsmanship, timeless aesthetics, and everyday elegance. While starting out on major marketplaces like Meesho, Amazon, and Flipkart, our goal was always to connect discerning homemakers directly with the finest regional crafts.
                </p>
                <p>
                  Today, by launching our direct-to-customer platform, we can guarantee personalized inspection, careful protective packaging, and dedicated support for every single home order.
                </p>
              </div>

              {/* Founders Box - Elegant and professional */}
              <div className="pt-4 border-t border-stone-200/80">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-2">
                  Founders
                </span>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-900 text-white font-serif font-bold text-base flex items-center justify-center">
                      SC
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-900 text-sm">Shreasth Chaturvedi</h4>
                      <span className="text-xs text-stone-500">Co-Founder & Product Lead</span>
                    </div>
                  </div>

                  <div className="hidden sm:block text-stone-300">•</div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-stone-800 text-amber-200 font-serif font-bold text-base flex items-center justify-center">
                      SC
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-900 text-sm">Samiksha Chaturvedi</h4>
                      <span className="text-xs text-stone-500">Co-Founder & Curation Lead</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Craft Photo */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80"
                  alt="Royes Creations Artisanal Decor"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-stone-950/20" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3.5 rounded-xl border border-white/50 text-xs">
                  <span className="font-semibold text-stone-900 block">Rooted in Pink City</span>
                  <span className="text-stone-600">Celebrating Rajasthani artisans & contemporary living</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. JAIPUR DELIVERY & FREE SHIPPING RULES */}
      <section id="delivery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-brand-950 text-white rounded-3xl p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-800/80 text-amber-300 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Jaipur Exclusive Network</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
                Currently Delivering Exclusively in Jaipur
              </h2>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                To guarantee uncompromised quality, zero transit damages, and quick direct turnaround, Royes Creations initially delivers only to addresses within Jaipur, Rajasthan.
              </p>

              {/* Delivery Charge Rule Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-stone-800/80 rounded-2xl p-5 border border-stone-700 space-y-2">
                  <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold block">
                    Orders ₹1499 & Below
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl font-bold text-white">₹49</span>
                    <span className="text-xs text-stone-400">Flat Delivery Fee</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-normal">
                    Secure doorstep delivery anywhere in Jaipur urban and rural zones.
                  </p>
                </div>

                <div className="bg-brand-900/60 rounded-2xl p-5 border border-brand-700/80 space-y-2 relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Free
                  </div>
                  <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold block">
                    Orders Above ₹1499
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl font-bold text-emerald-400">₹0</span>
                    <span className="text-xs text-stone-300">FREE Priority Delivery</span>
                  </div>
                  <p className="text-[11px] text-stone-300 leading-normal">
                    Add ₹1500 or more to your bag to automatically unlock free shipping!
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Live Interactive Pincode Checker */}
            <div className="lg:col-span-5 bg-white text-stone-900 rounded-2xl p-6 sm:p-8 shadow-xl">
              <PincodeChecker />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
