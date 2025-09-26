'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Clear cart after successful payment
    clearCart();
  }, [clearCart]);

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
          {sessionId && (
            <p className="text-gray-500 text-sm mb-6">
              Order ID: {sessionId}
            </p>
          )}
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
