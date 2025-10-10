'use client'

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { fetchClientSecret } from '@/app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor?: string;
}

interface EmbeddedCheckoutProps {
  items: CartItem[];
}

export default function EmbeddedCheckoutComponent({ items }: EmbeddedCheckoutProps) {
  const fetchClientSecretWrapper = async (): Promise<string> => {
    const clientSecret = await fetchClientSecret(items);
    if (!clientSecret) {
      throw new Error('Failed to create checkout session');
    }
    return clientSecret;
  };

  return (
    <div id="checkout" className="w-full">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret: fetchClientSecretWrapper }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}