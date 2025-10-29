// client/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'highway delite',
  description: 'Book your next experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 👇 UPDATE THIS LINE 👇 */}
      <body className={`${inter.className} bg-white`}>
        {children}
      </body>
    </html>
  );
}