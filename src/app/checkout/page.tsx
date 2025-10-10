'use client';

import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import Navigation from '@/components/Navigation';
import EmbeddedCheckoutComponent from '@/components/StripeEmbeddedCheckout';
import { useRouter } from 'next/navigation';

export default function EmbeddedCheckoutPage() {
  const { state } = useCart();
  const router = useRouter();
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const handleSuccess = () => {
    setCheckoutComplete(true);
    // Redirect to success page after a short delay
    setTimeout(() => {
      router.push('/success');
    }, 2000);
  };

  const handleError = (error: string) => {
    console.error('Checkout error:', error);
    // You could show an error message to the user here
  };

  if (checkoutComplete) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-green-500 text-6xl mb-6">
              <i className="fas fa-check-circle"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-700 text-lg mb-6">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            <p className="text-gray-500 text-sm">
              Redirecting to confirmation page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-gray-400 text-6xl mb-6">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-700 text-lg mb-6">
              Add some items to your cart before checking out.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h1>
              <p className="text-gray-600 mt-2">
                Secure checkout powered by Stripe
              </p>
            </div>
            
            <div className="p-6">
              <EmbeddedCheckoutComponent
                items={state.items}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
