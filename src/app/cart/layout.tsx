import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Shopping Cart - Shahada Car Decals | DeenDecal",
  description: "Review your Shahada car decals and Islamic car emblems in your shopping cart. Premium Islamic car accessories with free shipping.",
  keywords: "Shahada car decal cart, Islamic car emblem shopping, Muslim car accessories cart, DeenDecal checkout",
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
