"use client"; // This file holds all the client-side logic

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation'; 
import { useState, useEffect } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// PromoCode type for state
type AppliedPromoCode = {
    _id: string;
    code: string;
    discountType: 'percentage' | 'flat';
    discountValue: number;
};

// This component contains all the logic and JSX from your old page
export default function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter(); 
  // Initialize router

  // --- State for Form Inputs ---
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<AppliedPromoCode | null>(null);
  const [promoCodeError, setPromoCodeError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Data from URL ---
  const experienceId = searchParams.get('experienceId');
  const title = searchParams.get('title');
  const slotId = searchParams.get('slotId');
  const startTimeISO = searchParams.get('startTime');
  const basePriceString = searchParams.get('basePrice');
  const quantity = 1; 

  // --- Derived Calculations ---
  const basePrice = parseFloat(basePriceString || '0');
  const subtotal = basePrice * quantity;
  const taxes = subtotal * 0.1; 
  let discountAmount = 0;
  if (appliedPromoCode) {
    if (appliedPromoCode.discountType === 'percentage') {
      discountAmount = subtotal * (appliedPromoCode.discountValue / 100);
    } else if (appliedPromoCode.discountType === 'flat') {
      discountAmount = appliedPromoCode.discountValue;
    }
  }
  discountAmount = Math.min(discountAmount, subtotal);
  const finalSubtotalAfterDiscount = subtotal - discountAmount;
  const finalTotal = Math.max(0, finalSubtotalAfterDiscount + taxes);
  const formattedDate = startTimeISO ? new Date(startTimeISO).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
  const formattedTime = startTimeISO ? new Date(startTimeISO).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : 'N/A';

  // --- Form Validation ---
  const isFormValid = fullName.trim() !== '' && email.trim() !== '' && agreedToTerms && !isProcessing;

  // --- Handlers ---
  const handleApplyPromoCode = async () => {
    setPromoCodeError(null);
    setAppliedPromoCode(null);
    if (!promoCodeInput.trim()) {
      setPromoCodeError("Please enter a promo code.");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/promo-codes/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCodeInput.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to apply promo code.');
      setAppliedPromoCode(data.promoCode);
    } catch (error: any) {
      setPromoCodeError(error.message);
      console.error('Error applying promo code:', error);
    }
  };

  const handlePayAndConfirm = async () => {
    setBookingError(null);
    if (!isFormValid) {
      setBookingError("Please fill all required fields and agree to the terms.");
      return;
    }
    if (!experienceId || !slotId || !startTimeISO) {
        setBookingError("Booking details are missing. Please go back and select an experience slot.");
        return;
    }
    setIsProcessing(true);
    try {
      const bookingData = {
        experienceId,
        slotId,
        startTime: startTimeISO, 
        customerName: fullName,
        customerEmail: email,
        quantity,
        totalPrice: finalTotal,
        promoCode: appliedPromoCode ? appliedPromoCode._id : undefined, 
      };
      const res = await fetch(`${BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking failed. Please try again.');
      router.push(`/booking-success?bookingId=${data.booking._id}&experienceTitle=${encodeURIComponent(title || '')}`);
    } catch (error: any) {
      setBookingError(error.message);
      console.error('Error during booking:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Redirect if essential data is missing ---
  useEffect(() => {
    if (!experienceId || !slotId || !basePriceString || !startTimeISO) {
      console.warn("Missing essential booking details, redirecting to home.");
      router.push('/');
    }
  }, [experienceId, slotId, basePriceString, startTimeISO, router]);


  // Render loading state if core data is missing
  if (!experienceId || !slotId || !basePriceString || !startTimeISO) {
    return (
        <main className="max-w-[1440px] mx-auto px-[124px] py-12">
            <p className="text-center text-gray-600">Loading booking details or redirecting...</p>
        </main>
    );
  }

  // --- Main Render ---
  return (
      <main className="max-w-[1440px] mx-auto px-[124px] py-12 flex-grow">
        <button onClick={() => router.back()} className="text-sm font-medium text-gray-600 mb-6 inline-flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
           Checkout
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Your Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD643] focus:border-transparent"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD643] focus:border-transparent"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Promo Code</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD643] focus:border-transparent"
                  placeholder="Promo code"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                />
                <button
                  onClick={handleApplyPromoCode}
                  className="px-6 py-2 bg-[#FFD643] text-black rounded-lg font-semibold hover:bg-[#FFD643]/90 transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoCodeError && <p className="text-red-500 text-sm mt-2">{promoCodeError}</p>}
              {appliedPromoCode && (
                <p className="text-green-600 text-sm mt-2">
                  Promo code "{appliedPromoCode.code}" applied!
                  {appliedPromoCode.discountType === 'percentage' ?
                    ` You get ${appliedPromoCode.discountValue}% off.` :
                    ` You get ₹${appliedPromoCode.discountValue} off.`
                  }
                </p>
              )}
            </div>

            {/* Terms and Policies */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agreedToTerms"
                  className="h-4 w-4 text-[#FFD643] border-gray-300 rounded focus:ring-[#FFD643]"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  required
                />
                <label htmlFor="agreedToTerms" className="ml-2 block text-sm text-gray-900">
                  I agree to the <Link href="/terms" target="_blank" className="text-blue-600 hover:underline">terms</Link> and <Link href="/safety" target="_blank" className="text-blue-600 hover:underline">safety policies</Link>.
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#F0F0F0] rounded-lg p-6 shadow-md sticky top-[115px] border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium text-right">{title || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{formattedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                <hr className="border-gray-300 my-3"/>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(0)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount ({appliedPromoCode?.code})</span>
                    <span>-₹{discountAmount.toFixed(0)}</span>
                  </div>
                )}
                 <div className="flex justify-between text-gray-600">
                  <span>Taxes</span>
                  <span>₹{taxes.toFixed(0)}</span>
                </div>
                <hr className="border-gray-400 my-3"/>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(0)}</span>
                </div>
              </div>
              {bookingError && <p className="text-red-500 text-sm mb-4">{bookingError}</p>}
              <button
                onClick={handlePayAndConfirm}
                disabled={!isFormValid || isProcessing}
                className={`w-full text-black rounded-lg py-3 font-semibold transition-colors ${
                  isFormValid && !isProcessing ? 'bg-[#FFD643] hover:bg-[#FFD643]/90' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Pay and Confirm'}
              </button>
            </div>
          </div>
        </div>
      </main>
  );
}
