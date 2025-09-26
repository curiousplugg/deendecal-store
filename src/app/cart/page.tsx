'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import getStripe from '@/lib/stripe-client';

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart();

  const handleCheckout = async () => {
    if (state.items.length === 0) return;

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: state.items }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      const { sessionId } = data;
      const stripe = await getStripe();
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('There was an error during checkout. Please try again.');
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
      acc[key] = { ...item, quantity: 0 };
    }
    acc[key].quantity += item.quantity;
    return acc;
  }, {} as Record<string, typeof state.items[0] & { quantity: number }>);

  return (
    <div className="cart-page">
      {/* Header */}
      <header className="header">
        <div className="header-top">
          <div className="container">
            <div className="header-top-content">
              <div className="promo-banner">
                <i className="fas fa-gift"></i>
                <span>Free shipping on all orders</span>
              </div>
              <div className="header-top-links">
                <a href="#">Track Order</a>
                <a href="#">Help</a>
                <a href="#">Contact</a>
              </div>
            </div>
          </div>
        </div>
        <nav className="main-nav">
          <div className="container">
            <div className="nav-content">
              <div className="logo">
                <Link href="/">
                  <h1>DeenDecal</h1>
                  <p className="tagline">Express Your Faith</p>
                </Link>
              </div>
              <div className="nav-links">
                <Link href="/#home">Home</Link>
                <Link href="/#product">Product</Link>
                <Link href="/#installation">Installation</Link>
                <Link href="/#about">About</Link>
                <Link href="/#contact">Contact</Link>
              </div>
              <div className="nav-actions">
                <Link href="/cart" className="cart-btn">
                  <i className="fas fa-shopping-cart"></i>
                  <span>Cart</span>
                  <span className="cart-count">{state.items.reduce((total, item) => total + item.quantity, 0)}</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

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
              {Object.values(groupedItems).map((item, index) => {
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
