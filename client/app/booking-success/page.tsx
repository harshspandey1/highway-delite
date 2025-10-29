// client/app/booking-success/page.tsx
"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const experienceTitle = searchParams.get('experienceTitle');

  return (
    <>
      {/* Header */}
      <header className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <nav className="flex items-center justify-between h-[87px] max-w-[1440px] mx-auto px-[124px] py-4">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png" // Path to your logo in /public
              alt="Highway Delite Logo"
              width={100} // Adjust width as needed for your design
              height={30} // Adjust height as needed
              priority
            />
          </Link>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Search experience" className="px-4 py-2 border border-gray-300 rounded-lg"/>
            <button className="px-4 py-2 bg-[#FFD643] text-black rounded-lg font-semibold hover:bg-[#FFD643]/90">Search</button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-[124px] py-20 text-center flex-grow"> 
        <div className="bg-white p-10 rounded-lg shadow-xl border border-gray-200 inline-block"> 
       

          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Booking Confirmed!</h1>
          <p className="text-md text-gray-600 mb-4">Thank you for booking your experience with us.</p>
          {experienceTitle && <p className="text-lg font-medium text-gray-700 mb-4">Your experience: <span className="font-semibold">{decodeURIComponent(experienceTitle)}</span></p>}
          {bookingId && <p className="text-sm text-gray-500 mb-6">Your booking reference: <span className="font-mono bg-gray-100 p-1 rounded text-gray-700">{bookingId}</span></p>}
          <Link href="/" className="px-6 py-3 bg-[#FFD643] text-black rounded-lg font-semibold hover:bg-[#FFD643]/90 transition-colors shadow-md">
            Return to Home
          </Link>
        </div>
      </main>
    </>
  );
}