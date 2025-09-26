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

      const { sessionId } = await response.json();
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="header">
        <div className="header-top">
          <div className="container">
            <div className="header-top-content">
              <div className="promo-banner">
                <i className="fas fa-gift"></i>
                <span>Free shipping on orders over $50</span>
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
                <button className="search-btn">
                  <i className="fas fa-search"></i>
                </button>
                <button className="account-btn">
                  <i className="fas fa-user"></i>
                </button>
                <Link href="/cart" className="cart-btn">
                  <i className="fas fa-shopping-cart"></i>
                  <span>Cart</span>
                  <span className="cart-count">{state.items.length}</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="container" style={{ paddingTop: '8rem' }}>
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">Your Shopping Cart</h1>

        {state.items.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600 mb-6">Your cart is empty.</p>
            <Link
              href="/"
              className="add-to-cart-btn"
              style={{ display: 'inline-block', textDecoration: 'none' }}
            >
              <i className="fas fa-shopping-cart"></i>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              {Object.values(groupedItems).map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center border-b border-gray-200 py-4 last:border-b-0"
                >
                  <div className="relative w-24 h-24 mr-4 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h2>
                    {item.selectedColor && (
                      <p className="text-gray-600 text-sm">Color: {item.selectedColor}</p>
                    )}
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <p className="text-green-600 font-bold mt-1">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-l border-r border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 h-fit">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 mb-4">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-200 pt-4 mt-4">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="add-to-cart-btn"
                style={{ width: '100%', marginTop: '1.5rem' }}
              >
                <i className="fas fa-credit-card"></i>
                Proceed to Checkout
              </button>
              <button
                onClick={clearCart}
                className="wishlist-btn"
                style={{ width: '100%', marginTop: '0.75rem' }}
              >
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
