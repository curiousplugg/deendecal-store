import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from '@/contexts/CartContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/DDlogo.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/DDlogo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/DDlogo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/DDlogo.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/DDlogo.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/DDlogo.png" />
        <meta name="msapplication-TileImage" content="/DDlogo.png" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        
        {/* TikTok Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
                var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
                ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

                ttq.load('D3JTBE3C77UCFFQTL14G');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />
        
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1734761660519903');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img height="1" width="1" style={{display: 'none'}}
            src="https://www.facebook.com/tr?id=1734761660519903&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
