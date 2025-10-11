'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import EmbeddedCheckoutComponent from '@/components/EmbeddedCheckout';
import { tiktokEvents } from '@/lib/tiktok-events';

export default function PakistaniCartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { t } = useLanguage();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleCheckout = () => {
    if (state.items.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }

    // Validate cart items
    const invalidItems = state.items.filter(item =>
      !item.selectedColor || !item.quantity || item.quantity <= 0
    );

    if (invalidItems.length > 0) {
      alert('Please ensure all items have a selected color and valid quantity.');
      return;
    }

    // Track InitiateCheckout event
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    tiktokEvents.trackInitiateCheckout(state.items as unknown as Record<string, string | number | boolean | undefined>[], subtotal);

    // Show checkout and scroll to it
    setShowCheckout(true);
    
    // Smooth scroll to checkout section
    setTimeout(() => {
      const checkoutElement = document.getElementById('checkout');
      if (checkoutElement) {
        checkoutElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Use items directly without grouping to prevent glitching
  const cartItems = state.items;

  return (
    <div className="cart-page">
      {/* Navigation */}
      <Navigation />

      <div className="cart-container" style={{ paddingTop: '8rem', paddingBottom: '2rem' }}>
        <div className="cart-header">
          <h1>{t('cart.title')}</h1>
          <p>{t('cart.subtitle')}</p>
        </div>

        {state.items.length === 0 ? (
          <div className="empty-cart">
            <h2>{t('cart.empty')}</h2>
            <p>{t('cart.empty_subtitle')}</p>
            <Link href="/pk" className="continue-shopping-btn">
              <i className="fas fa-shopping-cart"></i>
              {t('cart.continue_shopping')}
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item, index) => {
                const itemKey = `${item.id}-${item.selectedColor || 'default'}-${index}`;
                return (
                  <div key={itemKey} className="cart-item">
                    <div className="cart-item-image">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="cart-item-details">
                      <h3 className="cart-item-title">{item.name}</h3>
                      {item.selectedColor && (
                        <p className="cart-item-color">Color: {item.selectedColor}</p>
                      )}
                      <p className="cart-item-description">{item.description}</p>
                      <p className="cart-item-price">PKR {item.price.toLocaleString()}</p>
                    </div>
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <div className="quantity-display">{item.quantity}</div>
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(itemKey)}
                      >
                        <i className="fas fa-trash"></i>
                        {t('cart.remove')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-line">
                <span className="summary-label">{t('cart.subtotal')}</span>
                <span className="summary-value">PKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-line">
                <span className="summary-label">{t('cart.shipping')}</span>
                <span className="summary-value">{t('cart.free')}</span>
              </div>
              <div className="summary-line">
                <span className="summary-label">{t('cart.total')}</span>
                <span className="summary-value">PKR {subtotal.toLocaleString()}</span>
              </div>
              <button onClick={handleCheckout} className="checkout-btn">
                <i className="fas fa-credit-card"></i>
                {t('cart.proceed_checkout')}
              </button>
              <button onClick={clearCart} className="clear-cart-btn">
                <i className="fas fa-trash"></i>
                {t('cart.clear_cart')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Checkout Section */}
      {showCheckout && state.items.length > 0 && (
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 text-center">
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
      )}

    </div>
  );
}
