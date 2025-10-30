"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "https://highway-delite-production-e4f3.up.railway.app";

export default function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const experienceId = searchParams.get("experienceId");
  const title = searchParams.get("title");
  const slotId = searchParams.get("slotId");
  const startTime = searchParams.get("startTime");
  const basePrice = Number(searchParams.get("basePrice") || 0);

  const taxes = basePrice * 0.1;
  const total = basePrice + taxes;

  const handleBooking = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceId,
          slotId,
          customerName: "Guest",
          customerEmail: "guest@example.com",
          totalPrice: total,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(
          `/booking-success?bookingId=${data._id}&experienceTitle=${encodeURIComponent(title || "")}`
        );
      } else {
        alert(data.message || "Booking failed.");
      }
    } catch (error) {
      console.error("Error booking:", error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-[1440px] mx-auto px-[124px] py-12 flex flex-col items-center">
      <div className="w-full max-w-lg bg-white border border-gray-200 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Checkout</h1>
        <p className="text-gray-700 mb-2">Experience: <span className="font-medium">{title}</span></p>
        <p className="text-gray-700 mb-2">Start Time: <span className="font-medium">{new Date(startTime || "").toLocaleString()}</span></p>
        <p className="text-gray-700 mb-2">Base Price: ₹{basePrice.toFixed(0)}</p>
        <p className="text-gray-700 mb-2">Taxes (10%): ₹{taxes.toFixed(0)}</p>
        <hr className="my-3" />
        <p className="text-lg font-semibold mb-6">Total: ₹{total.toFixed(0)}</p>

        <button
          onClick={handleBooking}
          disabled={isSubmitting}
          className={`w-full py-3 rounded-lg font-semibold ${
            isSubmitting
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#FFD643] hover:bg-[#FFD643]/90 text-black"
          }`}
        >
          {isSubmitting ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
    </main>
  );
}
