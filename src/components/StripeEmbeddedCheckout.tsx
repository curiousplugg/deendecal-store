'use client';

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { fetchClientSecret } from '@/app/actions/stripe';
import { useMemo } from 'react';

// Pre-load Stripe for faster initialization
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!, {
  locale: 'en' // Set locale for faster loading
});

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor?: string;
}

interface StripeEmbeddedCheckoutProps {
  items: CartItem[];
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function StripeEmbeddedCheckoutComponent({ 
  items, 
  onSuccess, 
  onError 
}: StripeEmbeddedCheckoutProps) {
  // Memoize the fetch function to prevent unnecessary re-creations
  const fetchClientSecretWrapper = useMemo(() => {
    return async (): Promise<string> => {
      try {
        // Create a fresh checkout session with current cart items
        const clientSecret = await fetchClientSecret(items);
        if (!clientSecret) {
          throw new Error('Failed to create checkout session');
        }
        return clientSecret;
      } catch (error) {
        console.error('Error creating checkout session:', error);
        onError?.(error instanceof Error ? error.message : 'Failed to create checkout session');
        throw error;
      }
    };
  }, [items, onError]);

  return (
    <div id="checkout" className="w-full">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ 
          fetchClientSecret: fetchClientSecretWrapper,
          onComplete: () => {
            onSuccess?.();
          }
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
