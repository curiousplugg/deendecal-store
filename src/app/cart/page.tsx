'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import getStripe from '@/lib/stripe-client';
import Navigation from '@/components/Navigation';

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart();

  const handleCheckout = async () => {
    console.log('🛒 Checkout button clicked');
    console.log('📦 Cart items:', state.items);
    
    if (state.items.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }

    try {
      console.log('🚀 Sending checkout request...');
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: state.items }),
      });
      
      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error || 'Checkout failed');
      }

      const data = await response.json();
      console.log('✅ Checkout session created:', data.sessionId);
      
      // Load Stripe
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      console.log('🔄 Redirecting to Stripe checkout...');
      const { error } = await stripe.redirectToCheckout({ 
        sessionId: data.sessionId 
      });
      
      if (error) {
        console.error('❌ Stripe redirect error:', error);
        throw new Error(error.message || 'Failed to redirect to checkout');
      }
    } catch (error) {
      console.error('❌ Error during checkout:', error);
      alert(`Checkout error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Group items by color for better display
  const groupedItems = state.items.reduce((acc, item) => {
    const key = `${item.id}-${item.selectedColor || 'default'}`;
    if (!acc[key]) {
      acc[key] = { ...item };
    } else {
      acc[key].quantity += item.quantity;
    }
    return acc;
  }, {} as Record<string, typeof state.items[0] & { quantity: number }>);

  return (
    <div className="cart-page">
      {/* Navigation */}
      <Navigation />

      <div className="cart-container" style={{ paddingTop: '8rem' }}>
        <div className="cart-header">
          <h1>Your Shopping Cart</h1>
          <p>Review your items and proceed to checkout</p>
        </div>

        {state.items.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some beautiful Islamic car emblems to get started</p>
            <Link href="/" className="continue-shopping-btn">
              <i className="fas fa-shopping-cart"></i>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {Object.values(groupedItems).map((item) => {
                const itemKey = `${item.id}-${item.selectedColor || 'default'}`;
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
                      <p className="cart-item-price">${item.price.toFixed(2)}</p>
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
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-line">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span className="summary-label">Shipping</span>
                <span className="summary-value">Free</span>
              </div>
              <div className="summary-line">
                <span className="summary-label">Total</span>
                <span className="summary-value">${subtotal.toFixed(2)}</span>
              </div>
              <button onClick={handleCheckout} className="checkout-btn">
                <i className="fas fa-credit-card"></i>
                Proceed to Checkout
              </button>
              <button onClick={clearCart} className="clear-cart-btn">
                <i className="fas fa-trash"></i>
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
