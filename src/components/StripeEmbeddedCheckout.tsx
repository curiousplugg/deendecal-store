'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider
} from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { fetchClientSecret } from '@/app/actions/stripe';

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
  onError 
}: StripeEmbeddedCheckoutProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Validate environment variable
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      const errorMsg = 'Stripe publishable key is not configured';
      setError(errorMsg);
      onError?.(errorMsg);
      setIsLoading(false);
      return;
    }

    try {
      const stripe = loadStripe(publishableKey, {
        locale: 'en'
      });
      setStripePromise(stripe);
      setIsLoading(false);
    } catch {
      const errorMsg = 'Failed to initialize Stripe';
      setError(errorMsg);
      onError?.(errorMsg);
      setIsLoading(false);
    }
  }, [onError]);

  // Memoize the fetch function to prevent unnecessary re-creations
  const fetchClientSecretWrapper = useMemo(() => {
    return async (): Promise<string> => {
      try {
        console.log('Fetching client secret for items:', items);
        
        // Validate items
        if (!items || items.length === 0) {
          throw new Error('No items provided for checkout');
        }

        // Create a fresh checkout session with current cart items
        const clientSecret = await fetchClientSecret(items);
        console.log('Client secret received:', clientSecret ? 'Yes' : 'No');
        
        if (!clientSecret) {
          throw new Error('No client secret returned from server');
        }
        
        return clientSecret;
      } catch (error) {
        console.error('Error creating checkout session:', error);
        const errorMsg = error instanceof Error ? error.message : 'Failed to create checkout session';
        setError(errorMsg);
        onError?.(errorMsg);
        throw error;
      }
    };
  }, [items, onError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Checkout Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Stripe Not Initialized</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Stripe is not properly configured. Please check your environment variables.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout" className="w-full">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ 
          fetchClientSecret: fetchClientSecretWrapper
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
