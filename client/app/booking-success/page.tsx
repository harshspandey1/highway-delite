import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react'; // Crucial for fixing the build error
import BookingSuccessClient from './BookingSuccessClient'; // Import the client component

export default function BookingSuccessPage() {
  return (
    <>
      {/* Header (Static) */}
      <header className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <nav className="flex items-center justify-between h-[87px] max-w-[1440px] mx-auto px-[124px] py-4">
          <Link href="/" className="flex items-center">
            {/* Logo image setup */}
            <Image
              src="/highway-delite-logo.png"
              alt="Highway Delite Logo"
              width={180}
              height={50}
              priority
            />
          </Link>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Search experience" className="px-4 py-2 border border-gray-300 rounded-lg"/>
            <button className="px-4 py-2 bg-[#FFD643] text-black rounded-lg font-semibold hover:bg-[#FFD643]/90">Search</button>
          </div>
        </nav>
      </header>

      {/* Wrap the client component in Suspense to fix the prerender error */}
      <Suspense fallback={<LoadingFallback />}>
        <BookingSuccessClient />
      </Suspense>
    </>
  );
}

function LoadingFallback() {
  return (
    <main className="max-w-[1440px] mx-auto px-[124px] py-12">
      <p className="text-center text-gray-600">Loading Confirmation...</p>
    </main>
  );
}
