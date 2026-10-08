'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { validateJaipurLocation } from '@/lib/delivery';
import {
  ShieldCheck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Upload,
  ArrowRight,
  QrCode,
  Smartphone,
  Lock,
  ChevronLeft,
  Loader2,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, deliveryCharge, total, clearCart } = useCart();

  // Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [houseFlat, setHouseFlat] = useState('');
  const [streetArea, setStreetArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city] = useState('Jaipur');
  const [state] = useState('Rajasthan');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');

  // Payment Verification State
  const [utr, setUtr] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Validation & Submission State
  const [pincodeValidation, setPincodeValidation] = useState<{
    isValid: boolean;
    message?: string;
    areaName?: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UPI Configuration
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || 'royescreations@upi';
  const payeeName = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || 'Royes Creations';

  // Live validate pincode when typed
  useEffect(() => {
    if (pincode.length === 6) {
      const res = validateJaipurLocation(pincode, city, state);
      setPincodeValidation(res);
    } else if (pincode.length > 0) {
      setPincodeValidation({
        isValid: false,
        message: 'PIN code must be 6 digits.',
      });
    } else {
      setPincodeValidation(null);
    }
  }, [pincode, city, state]);

  // Construct UPI deep-link URL for mobile
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${total}&cu=INR&tn=${encodeURIComponent('Royes Creations Order')}`;

  // Dynamically generated QR code API URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    upiDeepLink
  )}&margin=10`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingScreenshot(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setScreenshotUrl(data.url);
      } else {
        setErrorMsg(data.message || 'Screenshot upload failed.');
      }
    } catch (err: any) {
      setErrorMsg('Failed to upload screenshot. Please enter your UTR number.');
    } finally {
      setIsUploadingScreenshot(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Validate Form Fields
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!houseFlat.trim() || !streetArea.trim()) {
      setErrorMsg('Please provide complete house/flat and street address.');
      return;
    }

    // 2. Strict Jaipur Location Enforcement
    const locationCheck = validateJaipurLocation(pincode, city, state);
    if (!locationCheck.isValid) {
      setErrorMsg(
        locationCheck.message ||
          'Delivery is currently available exclusively within Jaipur, Rajasthan.'
      );
      return;
    }

    // 3. Payment Verification Check
    if (!utr.trim() && !screenshotUrl) {
      setErrorMsg(
        'Please enter your 12-digit UPI UTR / Transaction ID or upload your payment screenshot to verify payment.'
      );
      return;
    }

    if (items.length === 0) {
      setErrorMsg('Your cart is empty. Please add items before placing an order.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer_name: fullName.trim(),
        mobile: cleanMobile,
        email: email.trim() || undefined,
        house_flat: houseFlat.trim(),
        street_area: streetArea.trim(),
        landmark: landmark.trim() || undefined,
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: pincode.trim(),
        utr: utr.trim() || undefined,
        payment_screenshot: screenshotUrl || undefined,
        notes: notes.trim() || undefined,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to place order.');
      }

      // Success: clear cart and redirect to success page
      clearCart();
      router.push(`/order-success/${data.orderNumber}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during order submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="font-serif text-3xl font-bold text-stone-900">Your Cart is Empty</h1>
        <p className="text-sm text-stone-500">
          Please add items to your shopping bag before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-900 text-white font-semibold text-sm rounded-xl"
        >
          <span>Return to Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      
      {/* Checkout Breadcrumb */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-1"
          >
            <ChevronLeft className="w-4 h-4" /> Return to Cart
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Secure Prepaid Checkout
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Jaipur Direct Checkout</span>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-2xl text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">Checkout Error</span>
            <p>{errorMsg}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Customer & Delivery Address & Payment */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Customer Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft space-y-6">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-brand-900 text-white font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h2 className="font-serif text-lg font-bold text-stone-900">
                  Customer Contact Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="98290XXXXX"
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-brand-700 focus:outline-none font-medium tracking-wider"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">
                    Email Address <span className="text-stone-400 font-normal">(Optional for tracking updates)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Jaipur Delivery Address */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-900 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <h2 className="font-serif text-lg font-bold text-stone-900">
                    Jaipur Delivery Address
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Jaipur Only
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">
                      House / Flat / Plot No. <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={houseFlat}
                      onChange={(e) => setHouseFlat(e.target.value)}
                      placeholder="e.g. Flat 302, Royal Residency"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-brand-700 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">
                      Street / Area / Colony <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={streetArea}
                      onChange={(e) => setStreetArea(e.target.value)}
                      placeholder="e.g. Vaishali Nagar / Mansarovar"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-brand-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">
                    Landmark <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near National Handloom / Akshardham Temple"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">
                      City <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled
                      value={city}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-700 font-bold text-sm cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">
                      State <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled
                      value={state}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-700 font-bold text-sm cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700">
                      Pincode <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 302021"
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold tracking-wider focus:outline-none focus:ring-2 ${
                        pincodeValidation?.isValid === false
                          ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30'
                          : pincodeValidation?.isValid === true
                          ? 'border-emerald-400 focus:ring-emerald-400 bg-emerald-50/30'
                          : 'border-stone-300 focus:ring-brand-700'
                      }`}
                    />
                  </div>
                </div>

                {/* Live Pincode Validation Feedback */}
                {pincodeValidation && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                      pincodeValidation.isValid
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'bg-rose-50 text-rose-900 border border-rose-200'
                    }`}
                  >
                    {pincodeValidation.isValid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold block">
                        {pincodeValidation.isValid ? 'Jaipur Address Verified' : 'Location Not Eligible'}
                      </span>
                      <p className="text-[11px] opacity-90">{pincodeValidation.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Prepaid UPI Payment Details (NO COD) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-900 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <h2 className="font-serif text-lg font-bold text-stone-900">
                    Prepaid UPI / QR Payment
                  </h2>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  No COD • 100% Prepaid
                </span>
              </div>

              {/* Informative banner */}
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Official Royes Creations Payment Channel
                </span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Scan the QR code using any UPI app (GPay, PhonePe, Paytm, BHIM) or tap the mobile button to pay ₹{total.toLocaleString('en-IN')}. Then enter your 12-digit UTR number below.
                </p>
              </div>

              {/* QR and UPI Visual Display */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 bg-stone-50 rounded-2xl border border-stone-200">
                {/* QR Code Container */}
                <div className="md:col-span-5 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="p-3 bg-white rounded-2xl shadow-md border border-stone-200">
                    <img
                      src={qrCodeUrl}
                      alt="Royes Creations Official UPI Payment QR Code"
                      className="w-44 h-44 object-contain mx-auto"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-stone-500">
                    Scan using any UPI App
                  </span>
                </div>

                {/* Payment info & deep link */}
                <div className="md:col-span-7 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                      Payee Name
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-900">{payeeName}</h3>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
                      UPI ID (VPA)
                    </span>
                    <div className="flex items-center gap-2">
                      <code className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold text-brand-900">
                        {upiId}
                      </code>
                      <button
                        type="button"
                        onClick={copyUpiId}
                        className="p-1.5 px-3 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-stone-200">
                    <span className="text-xs text-stone-500">Total Payable Amount</span>
                    <div className="font-serif text-2xl font-black text-brand-900">
                      ₹{total.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Mobile Deep Link Button */}
                  <div className="pt-2">
                    <a
                      href={upiDeepLink}
                      className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Pay directly via UPI App (Mobile)</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* UTR / Transaction ID Input & Screenshot upload */}
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800">
                    12-digit UPI UTR / Transaction ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={utr}
                    onChange={(e) => setUtr(e.target.value.trim())}
                    placeholder="e.g. 428719283746"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-mono tracking-wider focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  />
                  <span className="text-[11px] text-stone-500">
                    Find this 12-digit number in your GPay / PhonePe / Paytm payment receipt details.
                  </span>
                </div>

                {/* Optional Screenshot Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">
                    Upload Payment Screenshot <span className="text-stone-400 font-normal">(Optional, helps faster verification)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-300 transition-colors">
                      <Upload className="w-4 h-4 text-stone-500" />
                      <span>{isUploadingScreenshot ? 'Uploading...' : 'Choose Screenshot'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                        disabled={isUploadingScreenshot}
                      />
                    </label>
                    {screenshotUrl && (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Screenshot Attached
                      </span>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Order Summary & Place Order Button */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-premium space-y-6">
              <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-4">
                Order Review ({items.length} items)
              </h2>

              {/* Items List in checkout */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-stone-900 truncate">{product.name}</h4>
                        <span className="text-stone-400">Qty: {quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900 shrink-0">
                      ₹{(product.price * quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-3 pt-4 border-t border-stone-200 text-sm">
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
                  <span className="font-serif font-black text-2xl text-brand-900">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-brand-900 hover:bg-brand-800 disabled:bg-stone-400 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying & Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Place Prepaid Order (₹{total.toLocaleString('en-IN')})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-stone-500 leading-relaxed">
                  By clicking Place Order, you confirm your delivery is within Jaipur and your UPI payment information is accurate.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                  <span>Direct Doorstep Handover in Jaipur</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Manual UTR Verification by Admin</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </form>

    </div>
  );
}
