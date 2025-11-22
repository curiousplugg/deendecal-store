'use client';

import React, { useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { tiktokEvents } from '@/lib/tiktok-events';

function SuccessContent() {
  const { clearCart, state } = useCart();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const hasClearedCart = useRef(false);

  useEffect(() => {
    // Only run once when we have a sessionId
    if (sessionId && !hasClearedCart.current) {
      hasClearedCart.current = true;
      
      // Track purchase before clearing cart
      if (state.items.length > 0) {
        const totalValue = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        tiktokEvents.trackPurchase(`order_${Date.now()}`, state.items as unknown as Record<string, string | number | boolean | undefined>[], totalValue);
      }
      
      // Clear cart after successful payment
      clearCart();
    }
  }, [sessionId]); // Only depend on sessionId

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
          <p className="text-gray-600 text-sm mb-6">
            If you have any questions, please email{' '}
            <a href="mailto:deendecal@gmail.com" className="text-blue-600 hover:text-blue-800">
              deendecal@gmail.com
            </a>
          </p>
          <a
            href="https://deendecal.com"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 inline-block"
          >
            Back to Home
          </a>
        </div>
      </div>
      
      {/* X (Twitter) Event Tracking */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            twq('event', 'tw-qm4yw-qm4yx', {
              conversion_id: '${sessionId || 'unknown'}',
              email_address: null,
              phone_number: null
            });
          `,
        }}
      />
      
      {/* Google Ads Conversion Tracking */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            gtag('event', 'conversion', {
              'send_to': 'AW-17655278257/7343991540',
              'transaction_id': '${sessionId || 'unknown'}',
              'value': 17.99,
              'currency': 'USD'
            });
          `,
        }}
      />
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
