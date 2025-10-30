"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";

// --- Type Definitions ---
type PromoCode = {
  _id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
};

// Use the Vercel-configured environment variable
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "https://highway-delite-production-e4f3.up.railway.app";

// --- Utility Functions ---
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export default function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // --- Data from URL Params ---
  const experienceId = searchParams.get("experienceId");
  const title = searchParams.get("title");
  const slotId = searchParams.get("slotId");
  const startTime = searchParams.get("startTime");
  const quantity = Number(searchParams.get("quantity") || 1); 
  const basePrice = Number(searchParams.get("basePrice") || 0);

  // --- State Management ---
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCode | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCodeError, setPromoCodeError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // --- Price Calculations ---
  const subtotal = basePrice * quantity;
  
  const discountAmount = useMemo(() => {
    if (!appliedPromoCode) return 0;
    
    let discount = 0;
    if (appliedPromoCode.discountType === 'percentage') {
        discount = subtotal * (appliedPromoCode.discountValue / 100);
    } else { // flat
        discount = appliedPromoCode.discountValue;
    }
    return Math.min(discount, subtotal);
  }, [appliedPromoCode, subtotal]);

  const priceAfterDiscount = subtotal - discountAmount;
  const taxes = priceAfterDiscount * 0.1; // 10% tax applied after discount
  const total = priceAfterDiscount + taxes;

  // --- Handlers ---
  const handleApplyPromoCode = async () => {
    if (!promoCodeInput) {
      setPromoCodeError("Please enter a code.");
      setAppliedPromoCode(null);
      return;
    }
    setPromoCodeError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/promo-codes/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCodeInput }),
      });

      const data = await res.json();

      if (res.ok) {
        setAppliedPromoCode(data.promoCode);
        setPromoCodeError(null);
      } else {
        setAppliedPromoCode(null);
        setPromoCodeError(data.message || "Invalid code.");
      }
    } catch (error) {
      setPromoCodeError("Could not connect to promo service.");
    }
  };

  const handleBooking = async () => {
    // Validation matching the mock-up requirements
    if (!customerName || !customerEmail) {
      alert("Please fill out your name and email.");
      return;
    }
    if (!agreedToTerms) {
        alert("You must agree to the terms and safety policy.");
        return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceId,
          slotId,
          customerName,
          customerEmail,
          quantity: quantity,
          totalPrice: total,
          promoCode: appliedPromoCode?._id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(
          `/booking-success?bookingId=${data.booking._id}&experienceTitle=${encodeURIComponent(title || "")}`
        );
      } else {
        alert(data.message || "Booking failed.");
      }
    } catch (error) {
      console.error("Error booking:", error);
      alert("Something went wrong with the booking service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isConfirmEnabled = slotId !== null && experienceId !== null && agreedToTerms && customerName && customerEmail;

  return (
    <main className="max-w-[1440px] mx-auto px-[124px] py-12 flex-grow">
        {/* Navigation/Back Button */}
        <Link href={`/experiences/${experienceId}`} className="text-sm font-medium text-gray-600 mb-4 inline-block">&larr; Checkout</Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Side: Forms (Col 1-3) */}
            <div className="lg:col-span-3 space-y-8">
                {/* Customer Details & Promo Code */}
                <div className="p-8 bg-white border border-gray-200 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6">Checkout with Details</h2>
                    
                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#FFD643] focus:border-[#FFD643]"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#FFD643] focus:border-[#FFD643]"
                            required
                        />
                    </div>
                    
                    {/* Promo Code Input */}
                    <div className="flex gap-2 relative">
                        <input
                            type="text"
                            placeholder="Promo code"
                            value={promoCodeInput}
                            onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg"
                            disabled={!!appliedPromoCode}
                        />
                        {/* Apply button with fixed styling */}
                        <button
                            onClick={handleApplyPromoCode}
                            disabled={isSubmitting || !!appliedPromoCode}
                            className={`
                                rounded-lg font-semibold transition-colors text-sm text-white
                                h-auto w-auto px-4 py-3 
                                ${
                                isSubmitting || !!appliedPromoCode
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-black hover:bg-gray-800" // Black background, white text
                                }
                            `}
                        >
                            {appliedPromoCode ? "APPLIED" : "APPLY"}
                        </button>
                    </div>
                    {promoCodeError && <p className="text-red-500 text-sm mt-2">{promoCodeError}</p>}
                    {appliedPromoCode && (
                        <div className="flex justify-between items-center bg-green-100 border border-green-300 p-2 mt-2 rounded">
                            <span className="text-green-700 text-sm font-medium">Code "{appliedPromoCode.code}" applied.</span>
                            <button 
                                onClick={() => { setAppliedPromoCode(null); setPromoCodeInput(''); }} 
                                className="text-sm text-green-700 underline hover:text-green-800"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>
                
                {/* --- Terms Checkbox --- */}
                <div className="flex items-center mt-6">
                    <input
                        id="terms-checkbox"
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="w-4 h-4 text-[#FFD643] border-gray-300 rounded focus:ring-[#FFD643]"
                    />
                    <label htmlFor="terms-checkbox" className="ml-2 text-sm font-medium text-gray-700">
                        I agree to the terms and safety policy
                    </label>
                </div>
            </div>

            {/* Right Side: Summary (Col 4-5) */}
            <div className="lg:col-span-2">
                <div className="bg-[#F0F0F0] rounded-lg p-6 shadow-md sticky top-[115px]">
                    <h2 className="text-xl font-bold mb-4">Summary</h2>
                    
                    {/* Summary Details */}
                    <div className="space-y-3 mb-6 border-b border-gray-300 pb-4">
                        <div className="flex justify-between"><span>Experience</span><span className="font-medium">{title}</span></div>
                        <div className="flex justify-between"><span>Date</span><span className="font-medium">{formatDate(startTime || "")}</span></div>
                        <div className="flex justify-between"><span>Time</span><span className="font-medium">{formatTime(startTime || "")}</span></div>
                        <div className="flex justify-between"><span>Qty</span><span className="font-medium">{quantity}</span></div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
                        {discountAmount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>- ₹{discountAmount.toFixed(0)}</span>
                            </div>
                        )}
                        <div className="flex justify-between"><span>Taxes</span><span>₹{taxes.toFixed(0)}</span></div>
                    </div>
                    
                    <hr className="my-3 border-gray-400"/>
                    
                    {/* Total */}
                    <div className="flex justify-between text-2xl font-bold mb-6">
                        <span>Total</span>
                        <span>₹{total.toFixed(0)}</span>
                    </div>

                    {/* Pay and Confirm Button (Matches mock-up context) */}
                    <button
                        onClick={handleBooking}
                        disabled={!isConfirmEnabled || isSubmitting}
                        className={`w-full text-black rounded-lg py-3 font-semibold transition-colors text-lg ${
                            !isConfirmEnabled || isSubmitting
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-[#FFD643] hover:bg-[#FFD643]/90"
                        }`}
                    >
                        {isSubmitting ? "Processing..." : `Pay and Confirm`}
                    </button>
                </div>
            </div>
        </div>
      </main>
  );
}