"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function BookingSuccessClient() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const experienceTitle = searchParams.get("experienceTitle");

  return (
    <main className="max-w-[1440px] mx-auto px-[124px] py-20 text-center flex-grow">
      <div className="bg-white p-10 rounded-lg shadow-xl border border-gray-200 inline-block">
        <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">Booking Confirmed!</h1>
        <p className="text-md text-gray-600 mb-4">Thank you for booking your experience with us.</p>

        {experienceTitle && (
          <p className="text-lg font-medium text-gray-700 mb-4">
            Experience: <span className="font-semibold">{decodeURIComponent(experienceTitle)}</span>
          </p>
        )}
        {bookingId && (
          <p className="text-sm text-gray-500 mb-6">
            Booking ID: <span className="font-mono bg-gray-100 p-1 rounded text-gray-700">{bookingId}</span>
          </p>
        )}

        <Link href="/" className="px-6 py-3 bg-[#FFD643] text-black rounded-lg font-semibold hover:bg-[#FFD643]/90 transition-colors shadow-md">
          Return Home
        </Link>
      </div>
    </main>
  );
}
