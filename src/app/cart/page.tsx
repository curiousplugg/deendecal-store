'use client';

import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useCart } from '@/contexts/CartContext';
import Navigation from '@/components/Navigation';
import { tiktokEvents } from '@/lib/tiktok-events';
import { loadStripe } from '@stripe/stripe-js';
import StripePreloader from '@/components/StripePreloader';

// Dynamically import Stripe's EmbeddedCheckout to prevent SSR issues
const EmbeddedCheckoutComponent = dynamic(
  () => import('@/components/StripeEmbeddedCheckout'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }
);

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Cart page error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>Something went wrong</h2>
            <p>There was an error loading the checkout component.</p>
            <button 
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="retry-btn"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [checkoutKey, setCheckoutKey] = useState(0);
  const [isRefreshingCheckout, setIsRefreshingCheckout] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  // Prevent hydration mismatch by only rendering after client mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Automatically load checkout when cart has items
  useEffect(() => {
    if (isClient && state.items.length > 0 && !checkoutComplete) {
      setShowCheckout(true);
    }
  }, [isClient, state.items.length, checkoutComplete]);

  // Countdown timer - counts down from 15 minutes and resets
  useEffect(() => {
    if (!isClient) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 15 * 60; // Reset to 15 minutes
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Preload Stripe for faster checkout loading
  useEffect(() => {
    if (isClient && state.items.length > 0) {
      // Preload Stripe when cart has items
      loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!, {
        locale: 'en'
      });
    }
  }, [isClient, state.items.length]);

  // Refresh checkout when cart items change
  useEffect(() => {
    if (showCheckout && !checkoutComplete) {
      // Show loading state briefly, then refresh checkout
      setIsRefreshingCheckout(true);
      // Reduced timeout for faster refresh
      setTimeout(() => {
        setCheckoutKey(prev => prev + 1);
        setIsRefreshingCheckout(false);
      }, 50);
    }
  }, [state.items, showCheckout, checkoutComplete]);

  // Handle cart being cleared while checkout is open
  useEffect(() => {
    if (showCheckout && state.items.length === 0) {
      setShowCheckout(false);
      setCheckoutComplete(false);
    }
  }, [showCheckout, state.items.length]);

  const handleEmbeddedCheckout = () => {
    if (state.items.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }

    // Track InitiateCheckout event
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    tiktokEvents.trackInitiateCheckout(state.items as unknown as Record<string, string | number | boolean | undefined>[], subtotal);

    // Ensure checkout is shown (it should already be loaded automatically)
    setShowCheckout(true);
    
    // Smooth scroll to checkout section
    setTimeout(() => {
      const checkoutSection = document.getElementById('embedded-checkout-section');
      if (checkoutSection) {
        checkoutSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const handleCheckoutSuccess = () => {
    setCheckoutComplete(true);
    clearCart();
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearCart = () => {
    if (showCheckout) {
      const confirmed = window.confirm(
        'You have an active checkout session. Clearing the cart will close the checkout. Are you sure you want to continue?'
      );
      if (!confirmed) return;
    }
    
    clearCart();
    setShowCheckout(false);
    setCheckoutComplete(false);
  };


  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Filter out invalid items and use items directly without grouping to prevent glitching
  const cartItems = state.items.filter(item => 
    item && 
    item.id && 
    item.name && 
    item.price && 
    item.quantity > 0
  );

  return (
    <div className="cart-page">
      {/* Navigation */}
      <Navigation />
      
      {/* Stripe Preloader for faster checkout loading */}
      <StripePreloader />
      
      <style jsx>{`
        .error-boundary {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          padding: 2rem;
        }
        
        .error-content {
          text-align: center;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 2rem;
          max-width: 400px;
        }
        
        .error-content h2 {
          color: #dc2626;
          margin-bottom: 1rem;
        }
        
        .error-content p {
          color: #7f1d1d;
          margin-bottom: 1.5rem;
        }
        
        .retry-btn {
          background: #dc2626;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .retry-btn:hover {
          background: #b91c1c;
        }

        /* Proceed to Checkout Button - Matching Nav Gold */
        .proceed-checkout-btn {
          width: 100%;
          background: #c89d24;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: bold;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 8px rgba(200, 157, 36, 0.3);
          transition: all 0.2s ease;
          margin-bottom: 1rem;
        }

        .proceed-checkout-btn:hover {
          background: #b88a1f;
          box-shadow: 0 6px 12px rgba(200, 157, 36, 0.4);
          transform: translateY(-1px);
        }

        .proceed-checkout-btn i {
          font-size: 1.2rem;
        }

        /* Embedded Checkout Section */
        .embedded-checkout-section {
          margin-top: 3rem;
          padding: 2rem;
          background: #f0f4f8;
          border-radius: 12px;
          display: flex;
          justify-content: center;
        }

        .checkout-container {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          max-width: 1000px;
          width: 100%;
        }

        /* Desktop - Much wider layout */
        @media (min-width: 1024px) {
          .checkout-container {
            max-width: 1400px;
            padding: 3rem;
          }
          
          .embedded-checkout-section {
            padding: 3rem;
          }
        }

        /* Large desktop - Even wider */
        @media (min-width: 1440px) {
          .checkout-container {
            max-width: 1600px;
            padding: 4rem;
          }
          
          .embedded-checkout-section {
            padding: 4rem;
          }
        }

        /* Mobile - Neat layout */
        @media (max-width: 768px) {
          .embedded-checkout-section {
            margin-top: 2rem;
            padding: 1rem;
          }
          
          .checkout-container {
            padding: 1.5rem;
            border-radius: 6px;
          }
          
          .checkout-title {
            font-size: 1.25rem;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .checkout-subtitle {
            font-size: 0.9rem;
          }
        }

        .checkout-header {
          margin-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 1.5rem;
          text-align: center;
        }

        .checkout-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #374151;
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .checkout-title i {
          color: #6b7280;
          font-size: 1.25rem;
        }

        .checkout-subtitle {
          color: #6b7280;
          font-size: 0.95rem;
          margin: 0;
          text-align: center;
        }

        .checkout-content {
          min-height: 400px;
        }

        /* Stripe Embedded Checkout Styling */
        .checkout-content :global(#checkout) {
          border-radius: 8px;
          overflow: hidden;
        }

        .checkout-content :global(.StripeElement) {
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 12px;
          background: white;
        }

        .checkout-content :global(.StripeElement--focus) {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Main cart container responsive styling */
        .cart-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        /* Desktop - Much wider layout for main content */
        @media (min-width: 1024px) {
          .cart-container {
            max-width: 1800px;
            padding: 0 2rem;
          }
        }

        /* Large desktop - Even wider */
        @media (min-width: 1440px) {
          .cart-container {
            max-width: 2000px;
            padding: 0 3rem;
          }
        }

        /* Mobile - Neat layout for main content */
        @media (max-width: 768px) {
          .cart-container {
            padding: 0 0.5rem;
          }
          
          .cart-header h1 {
            font-size: 1.75rem;
          }
          
          .cart-header p {
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="cart-container" style={{ paddingTop: '2rem' }}>
        <div className="cart-header">
          <h1>Your Shopping Cart</h1>
          <p>Review your items and proceed to checkout</p>
        </div>
        {isClient && state.items.length > 0 && (
          <div className="cart-header-badges">
            <span className="header-badge">
              <i className="fas fa-shipping-fast"></i>
              Free Shipping Worldwide
            </span>
            <span className="header-badge">
              <i className="fas fa-undo"></i>
              30-Day Returns
            </span>
          </div>
        )}

        {!isClient ? (
          <div className="empty-cart">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading cart...</p>
          </div>
        ) : state.items.length === 0 ? (
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
                      {item.image && item.image.trim() !== '' ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={120}
                          height={80}
                        />
                      ) : (
                        <div className="placeholder-image">
                          <i className="fas fa-image"></i>
                        </div>
                      )}
                    </div>
                    <div className="cart-item-content">
                      <div className="cart-item-details">
                        <h3 className="cart-item-title">{item.name}</h3>
                        {item.selectedColor && (
                          <p className="cart-item-color">Color: {item.selectedColor}</p>
                        )}
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
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              
              {/* Trust Badges */}
              <div className="cart-trust-badges">
                <div className="cart-trust-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>Secure Checkout</span>
                </div>
                <div className="cart-trust-item">
                  <i className="fas fa-undo"></i>
                  <span>30-Day Returns</span>
                </div>
                <div className="cart-trust-item">
                  <i className="fas fa-truck"></i>
                  <span>Free Shipping</span>
                </div>
              </div>

              <div className="summary-line">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span className="summary-label">Shipping</span>
                <span className="summary-value shipping-free">Free</span>
              </div>
              <div className="summary-line">
                <span className="summary-label">Total</span>
                <span className="summary-value total-price">${subtotal.toFixed(2)}</span>
              </div>

              {/* Social Proof */}
              <div className="cart-social-proof">
                <div className="social-proof-item">
                  <i className="fas fa-user-check"></i>
                  <span><strong>127+</strong> customers purchased today</span>
                </div>
                <div className="social-proof-item">
                  <i className="fas fa-shopping-cart"></i>
                  <span><strong>100+</strong> customers have items in cart now</span>
                </div>
              </div>

              {/* Urgency Message with Countdown */}
              <div className="cart-urgency">
                <i className="fas fa-clock"></i>
                <span>Complete your order in the next <strong className="countdown-timer">{formatTime(timeLeft)}</strong> to secure your items</span>
              </div>

              <div className="checkout-buttons">
                <button onClick={handleEmbeddedCheckout} className="proceed-checkout-btn">
                  <i className="fas fa-credit-card"></i>
                  Proceed to Secure Checkout
                </button>
                <button onClick={handleClearCart} className="clear-cart-btn">
                  <i className="fas fa-trash"></i>
                  Clear Cart
                </button>
              </div>

              {/* Security & Guarantee */}
              <div className="cart-security">
                <div className="security-item">
                  <i className="fas fa-lock"></i>
                  <span>SSL Encrypted • Your payment is secure</span>
                </div>
                <div className="security-item">
                  <i className="fas fa-dollar-sign"></i>
                  <span>100% Money-Back Guarantee</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="cart-payment-methods">
                <p className="payment-methods-label">We accept:</p>
                <div className="payment-icons-small">
                  <i className="fab fa-cc-visa"></i>
                  <i className="fab fa-cc-mastercard"></i>
                  <i className="fab fa-cc-amex"></i>
                  <i className="fab fa-cc-paypal"></i>
                  <i className="fab fa-apple-pay"></i>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Embedded Checkout Section */}
        {showCheckout && !checkoutComplete && (
          <div id="embedded-checkout-section" className="embedded-checkout-section">
            <div className="checkout-container">
              <div className="checkout-header">
                <h2 className="checkout-title">
                  <i className="fas fa-credit-card"></i>
                  Complete Your Purchase
                </h2>
                <p className="checkout-subtitle">
                  Complete your purchase below
                </p>
              </div>
              
              <div className="checkout-content">
                {isRefreshingCheckout ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Updating checkout...</p>
                    </div>
                  </div>
                ) : (
                  <ErrorBoundary>
                    <EmbeddedCheckoutComponent
                      key={checkoutKey}
                      items={state.items}
                      onSuccess={handleCheckoutSuccess}
                      onError={(error) => console.error('Checkout error:', error)}
                    />
                  </ErrorBoundary>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Success Message */}
        {checkoutComplete && (
          <div className="success-message">
            <div className="success-content">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2 className="success-title">Payment Successful!</h2>
              <p className="success-text">
                Thank you for your purchase. Your order has been placed successfully.
              </p>
              <Link href="/" className="continue-shopping-btn">
                <i className="fas fa-home"></i>
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
