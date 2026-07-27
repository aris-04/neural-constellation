import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Neural Constellation',
  description: 'GPU-accelerated music visualization',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-black text-white overflow-hidden`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}