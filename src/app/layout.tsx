import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import Toast from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'Royes Creations | Artisanal Lifestyle & Decor (Jaipur Exclusive)',
  description:
    'Thoughtfully chosen, beautifully delivered. Handcrafted home decor, Jaipur blue pottery, pure brassware, and lifestyle creations by Shreasth & Samiksha Chaturvedi. Fast delivery across Jaipur, Rajasthan.',
  keywords: [
    'Royes Creations',
    'Jaipur Home Decor',
    'Blue Pottery Jaipur',
    'Pure Brassware',
    'Handcrafted Gifts Jaipur',
    'Shreasth Chaturvedi',
    'Samiksha Chaturvedi',
    'D2C Brand Jaipur',
  ],
  authors: [{ name: 'Shreasth Chaturvedi & Samiksha Chaturvedi' }],
  openGraph: {
    title: 'Royes Creations | Artisanal Decor & Lifestyle',
    description: 'Thoughtfully chosen. Beautifully delivered. Exclusively for Jaipur, Rajasthan.',
    url: 'https://royescreations.com',
    siteName: 'Royes Creations',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Royes Creations Handcrafted Collection',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900 selection:bg-brand-200 selection:text-brand-900">
        <CartProvider>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <Toast />
        </CartProvider>
      </body>
    </html>
  );
}
