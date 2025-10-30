// client/app/checkout/CheckoutForm.tsx (Restored and Fixed)

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";

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

export default function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // --- Initial Data from URL Params ---
  const experienceId = searchParams.get("experienceId");
  const title = searchParams.get("title");
  const slotId = searchParams.get("slotId");
  const startTime = searchParams.get("startTime");
  // Assuming quantity is always 1 for this project setup
  const quantity = 1;
  const basePrice = Number(searchParams.get("basePrice") || 0);

  // --- State Management ---
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState<PromoCode | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCodeError, setPromoCodeError] = useState<string | null>(null);

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
    // Discount cannot exceed subtotal
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
    // Final Client-side validation
    if (!customerName || !customerEmail) {
      alert("Please fill out your name and email.");
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
          totalPrice: total, // Send calculated total
          promoCode: appliedPromoCode?._id, // Send promo code ID if applied
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

  const isConfirmEnabled = slotId !== null && experienceId !== null;

  return (
    <main className="max-w-[1440px] mx-auto px-[124px] py-12 flex flex-col items-center">
      <div className="w-full max-w-xl bg-white border border-gray-200 shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Complete Your Booking</h1>

        {/* --- Customer Information Form --- */}
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-3">Customer Information</h2>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FFD643] focus:border-[#FFD643]"
                    required
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FFD643] focus:border-[#FFD643]"
                    required
                />
            </div>
        </div>
        
        {/* --- Promo Code Section --- */}
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Promo Code</h2>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Enter Promo Code"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg"
                    disabled={!!appliedPromoCode} // Disable input if code is applied
                />
                <button
                    onClick={handleApplyPromoCode}
                    disabled={isSubmitting || !!appliedPromoCode}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                        isSubmitting || !!appliedPromoCode
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                >
                    {appliedPromoCode ? "Applied" : "Apply"}
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

        {/* --- Order Summary and Total --- */}
        <div className="space-y-3 mb-6 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
            <p className="text-gray-700 flex justify-between">
                <span>Experience:</span> <span className="font-medium">{title}</span>
            </p>
            <p className="text-gray-700 flex justify-between">
                <span>Time:</span> <span className="font-medium">{new Date(startTime || "").toLocaleString()}</span>
            </p>
            <div className="pt-2">
                <div className="flex justify-between text-base"><span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
                {discountAmount > 0 && (
                    <div className="flex justify-between text-base text-green-600">
                        <span>Discount ({appliedPromoCode?.discountType === 'percentage' ? `${appliedPromoCode.discountValue}%` : 'Flat'})</span>
                        <span>- ₹{discountAmount.toFixed(0)}</span>
                    </div>
                )}
                <div className="flex justify-between text-gray-600 text-sm"><span>Taxes (10%)</span><span>+ ₹{taxes.toFixed(0)}</span></div>
            </div>
            
            <hr className="my-3 border-gray-300"/>
            
            <div className="flex justify-between text-xl font-bold">
                <span>Total Payable</span>
                <span>₹{total.toFixed(0)}</span>
            </div>
        </div>

        {/* --- Confirm Button --- */}
        <button
          onClick={handleBooking}
          disabled={isSubmitting || !isConfirmEnabled}
          className={`w-full py-3 rounded-lg font-semibold transition-colors shadow-md ${
            isSubmitting
              ? "bg-gray-300 cursor-not-allowed text-white"
              : "bg-[#FFD643] hover:bg-[#FFD643]/90 text-black"
          }`}
        >
          {isSubmitting ? "Processing Payment..." : `Pay ₹${total.toFixed(0)} & Confirm`}
        </button>
      </div>
    </main>
  );
}