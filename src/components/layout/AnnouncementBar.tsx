'use client';

import React from 'react';
import { MapPin, ShieldCheck, Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-brand-900 text-brand-100 text-xs py-2 px-4 border-b border-brand-800 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <div className="flex items-center gap-2 font-medium tracking-wide">
          <span className="inline-flex items-center gap-1 bg-brand-800/80 px-2 py-0.5 rounded text-[11px] text-amber-300 font-semibold">
            <MapPin className="w-3 h-3" /> Jaipur Exclusive
          </span>
          <span>Delivering Exclusively Within Jaipur, Rajasthan</span>
        </div>
        
        <div className="flex items-center gap-4 text-brand-200">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>FREE Delivery Above <strong className="text-white font-semibold">₹1499</strong></span>
          </div>
          <span className="hidden md:inline-block text-brand-700">•</span>
          <div className="hidden md:flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>100% Secure Prepaid UPI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
