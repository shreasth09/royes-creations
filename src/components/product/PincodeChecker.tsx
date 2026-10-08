'use client';

import React, { useState } from 'react';
import { validateJaipurLocation } from '@/lib/delivery';
import { CheckCircle2, AlertCircle, MapPin, Search } from 'lucide-react';

export default function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<{
    checked: boolean;
    isValid: boolean;
    message?: string;
    areaName?: string;
  } | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim()) return;

    const res = validateJaipurLocation(pincode, 'Jaipur', 'Rajasthan');
    setResult({
      checked: true,
      isValid: res.isValid,
      message: res.message,
      areaName: res.areaName,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-brand-700" />
        <h3 className="font-serif text-lg font-bold text-stone-900">
          Check Delivery in Your Area
        </h3>
      </div>
      
      <p className="text-xs text-stone-500 leading-relaxed">
        Enter your 6-digit postal PIN code to confirm delivery eligibility in Jaipur.
      </p>

      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value.replace(/\D/g, ''));
              if (result) setResult(null);
            }}
            placeholder="e.g. 302001 or 302020"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-700 text-sm font-medium tracking-wider placeholder:font-normal placeholder:tracking-normal"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
        >
          Verify
        </button>
      </form>

      {/* Result feedback */}
      {result && result.checked && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 transition-all ${
            result.isValid
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {result.isValid ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5">
            <span className="font-semibold block">
              {result.isValid ? 'Eligible for Jaipur Delivery!' : 'Delivery Unavailable'}
            </span>
            <p className="text-[11px] leading-relaxed opacity-90">{result.message}</p>
            {result.areaName && (
              <span className="inline-block mt-1 font-semibold text-[10px] bg-emerald-200/60 px-2 py-0.5 rounded text-emerald-950">
                Zone: {result.areaName}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="pt-2 text-[11px] text-stone-500 border-t border-stone-100 flex items-center justify-between">
        <span>Popular: Mansarovar, Vaishali Nagar, Malviya Nagar, C-Scheme</span>
      </div>
    </div>
  );
}
