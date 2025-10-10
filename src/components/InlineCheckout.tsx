'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { tiktokEvents } from '@/lib/tiktok-events';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  colors?: string[];
  selectedColor?: string;
  material?: string;
  size?: string;
  style?: string;
  installationLocation?: string;
  packingSpecifications?: string;
  installationInstructions?: string[];
  quantity: number;
}

interface InlineCheckoutProps {
  items: CartItem[];
  onSuccess: () => void;
}

export default function InlineCheckout({ items, onSuccess }: InlineCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const createCheckoutSession = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      // Track InitiateCheckout event
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      tiktokEvents.trackInitiateCheckout(items, subtotal);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      console.log('✅ Checkout session created:', data.sessionId);
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('❌ Error creating checkout session:', error);
      setError(error instanceof Error ? error.message : 'Failed to create checkout session');
    } finally {
      setIsLoading(false);
    }
  }, [items]);

  useEffect(() => {
    if (items.length > 0) {
      createCheckoutSession();
    }
  }, [items, createCheckoutSession]);

  // Auto-focus the first input field when checkout loads
  useEffect(() => {
    if (clientSecret) {
      // Wait for the embedded checkout to render, then focus the first input
      const timer = setTimeout(() => {
        const firstInput = document.querySelector('input[type="text"], input[type="email"], input[type="tel"]') as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      }, 1000); // Wait 1 second for Stripe to render the form

      return () => clearTimeout(timer);
    }
  }, [clientSecret]);


  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Creating checkout session...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
              <button 
                onClick={createCheckoutSession}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl mx-auto mb-8">
      <div className="text-center mb-6">
        <div className="text-gray-500 text-4xl mb-4">
          <i className="fas fa-credit-card"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Purchase</h2>
        <p className="text-gray-600">Complete your purchase below</p>
      </div>

      {clientSecret && (
        <div className="w-full" style={{ overflow: 'visible' }}>
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ 
              clientSecret
            }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      )}
    </div>
  );
}
