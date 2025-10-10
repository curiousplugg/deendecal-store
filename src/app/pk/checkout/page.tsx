'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import EmbeddedCheckoutComponent from '@/components/EmbeddedCheckout';
import { useRouter } from 'next/navigation';

export default function PakistaniCheckoutPage() {
  const { state } = useCart();
  const { t } = useLanguage();
  const router = useRouter();

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-gray-400 text-6xl mb-6">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('cart.empty')}</h1>
            <p className="text-gray-700 text-lg mb-6">
              {t('cart.empty_subtitle')}
            </p>
            <button
              onClick={() => router.push('/pk')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
            >
              {t('cart.continue_shopping')}
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
              <h1 className="text-2xl font-bold text-gray-900">{t('checkout.title')}</h1>
              <p className="text-gray-600 mt-2">
                {t('checkout.subtitle')}
              </p>
            </div>

            <div className="p-6">
              <EmbeddedCheckoutComponent items={state.items} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
