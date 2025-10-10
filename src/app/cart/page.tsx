'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import Navigation from '@/components/Navigation';
import EmbeddedCheckoutModal from '@/components/EmbeddedCheckout';

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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

    // Open embedded checkout modal
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    // Clear cart after successful payment
    clearCart();
    // Close modal
    setIsCheckoutOpen(false);
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

      {/* Embedded Checkout Modal */}
      <EmbeddedCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={state.items}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
}
