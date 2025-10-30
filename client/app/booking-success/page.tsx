import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import BookingSuccessClient from "./BookingSuccessClient";

export default function BookingSuccessPage() {
  return (
    <>
      <header className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <nav className="flex items-center justify-between h-[87px] max-w-[1440px] mx-auto px-[124px] py-4">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Highway Delite Logo" width={100} height={30} priority />
          </Link>
        </nav>
      </header>

      <Suspense fallback={<p className="text-center py-20 text-gray-600">Loading...</p>}>
        <BookingSuccessClient />
      </Suspense>
    </>
  );
}
