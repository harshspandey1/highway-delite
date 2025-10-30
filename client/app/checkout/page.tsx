import Link from 'next/link';
import Image from 'next/image'; // Import Image for the logo
import { Suspense } from 'react'; // Import Suspense
import CheckoutForm from './CheckoutForm'; // Import our new client component

// This is now a simple Server Component. No "use client" here.
export default function CheckoutPage() {
  return (
    <>
      {/* Header (Static) */}
      <header className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <nav className="flex items-center justify-between h-[87px] max-w-[1440px] mx-auto px-[124px] py-4">
           <Link href="/" className="flex items-center">
            {/* Using Next.js Image component for the logo */}
            <Image
              src="/logo.png" 
              alt="Highway Delite Company Logo"
              width={100} 
              height={30} 
              priority
            />
          </Link>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Search experience" className="px-4 py-2 border border-gray-300 rounded-lg"/>
            <button className="px-4 py-2 bg-[#FFD643] text-black rounded-lg font-semibold hover:bg-[#FFD643]/90">Search</button>
          </div>
        </nav>
      </header>

      {/* Wrap the dynamic component in Suspense.
        This fixes the "useSearchParams" build error.
      */}
      <Suspense fallback={<LoadingFallback />}>
        <CheckoutForm />
      </Suspense>
    </>
  );
}

// A simple fallback component to show while the client component loads
function LoadingFallback() {
  return (
    <main className="max-w-[1440px] mx-auto px-[124px] py-12 flex-grow">
      <p className="text-center text-gray-600">Loading checkout...</p>
    </main>
  );
}
