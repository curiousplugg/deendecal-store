import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from '@/contexts/CartContext';
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shahada Car Decals | Premium Islamic Metal Emblems | DeenDecal",
  description: "Shop high-quality Shahada car decals & Islamic metal emblems. Durable, stylish, and faith-inspired. Free shipping on all orders! Premium metal construction.",
  keywords: "Shahada car decal, Islamic car emblem, Muslim car decal, Halal car sticker, Arabic calligraphy car decal, Shahada metal car emblem, Deen car accessory, Custom Islamic car decal, Islamic car accessories, Muslim car accessories, Islamic metal emblems, Shahada decals, Islamic stickers, Car decals for Muslims, Islamic car badges",
  authors: [{ name: "DeenDecal" }],
  creator: "DeenDecal",
  publisher: "DeenDecal",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://deendecal.com',
    title: 'Shahada Car Decals | Premium Islamic Metal Emblems | DeenDecal',
    description: 'Shop high-quality Shahada car decals & Islamic metal emblems. Durable, stylish, and faith-inspired. Free shipping on all orders!',
    siteName: 'DeenDecal',
    images: [
      {
        url: '/images/goldIndy.jpg',
        width: 1200,
        height: 630,
        alt: 'Premium Shahada Metal Car Decal - Gold',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shahada Car Decals | Premium Islamic Metal Emblems',
    description: 'Shop high-quality Shahada car decals & Islamic metal emblems. Durable, stylish, and faith-inspired. Free shipping on all orders!',
    images: ['/images/goldIndy.jpg'],
  },
  icons: {
    icon: [
      { url: "/DDlogo.png", sizes: "any" },
      { url: "/DDlogo.png", sizes: "32x32", type: "image/png" },
      { url: "/DDlogo.png", sizes: "16x16", type: "image/png" }
    ],
    shortcut: "/DDlogo.png",
    apple: [
      { url: "/DDlogo.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      { rel: "icon", url: "/DDlogo.png" }
    ]
  },
  alternates: {
    canonical: 'https://deendecal.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <link rel="icon" href="/DDlogo.png" type="image/png" />
        <link rel="shortcut icon" href="/DDlogo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/DDlogo.png" />
      </head>
      <body className={inter.className}>
        <CartProvider>
          {children}
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
