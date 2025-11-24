'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { track } from '@vercel/analytics';

interface EmailPopupProps {
  onClose: () => void;
  productImage?: string;
}

export default function EmailPopup({ onClose, productImage = '/images/goldIndy.jpg' }: EmailPopupProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'duplicate'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const popupRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrorMessage('Email is required');
      setStatus('error');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        // Mark as subscribed in localStorage (only on client)
        if (typeof window !== 'undefined') {
          localStorage.setItem('email_popup_subscribed', 'true');
        }
        
        if (data.alreadySubscribed) {
          setStatus('duplicate');
          track('Email Subscription', { status: 'duplicate', email: email.trim() });
        } else {
          setStatus('success');
          track('Email Subscription', { status: 'success', email: email.trim() });
        }
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
        track('Email Subscription', { status: 'error', error: data.error });
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Connection failed. Please try again.');
      track('Email Subscription', { status: 'error', error: 'network_error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="email-popup-overlay">
      <div className="email-popup" ref={popupRef}>
        {/* Close button */}
        <button
          className="email-popup-close"
          onClick={onClose}
          aria-label="Close popup"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Background image */}
        <div className="email-popup-background">
          <Image
            src={productImage}
            alt="Premium Shahada Metal Car Decal"
            fill
            style={{ objectFit: 'cover' }}
            quality={75}
            priority
          />
          <div className="email-popup-background-overlay"></div>
        </div>

        {/* Content */}
        <div className="email-popup-content">
          {status === 'success' ? (
            <div className="email-popup-success">
              <div className="email-popup-success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2>Success!</h2>
              <p>Check your email for your 20% off discount code.</p>
              <p className="email-popup-success-note">
                Didn&apos;t receive it? Check your spam folder or contact support.
              </p>
              <button
                className="email-popup-button"
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>
          ) : status === 'duplicate' ? (
            <div className="email-popup-success">
              <div className="email-popup-success-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h2>Already Subscribed!</h2>
              <p>This email is already subscribed! Check your inbox for your discount code.</p>
              <p className="email-popup-success-note">
                We&apos;ve sent you another email with your code.
              </p>
              <button
                className="email-popup-button"
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <h2 className="email-popup-title">
                You&apos;ve Got
                <br />
                <span className="email-popup-title-highlight">20% OFF!</span>
              </h2>
              <p className="email-popup-description">
                Join our email list to receive updates, access exclusive deals, learn product launch details, and more.
              </p>
              <form onSubmit={handleSubmit} className="email-popup-form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') {
                      setStatus('idle');
                      setErrorMessage('');
                    }
                  }}
                  placeholder="Enter email"
                  className="email-popup-input"
                  disabled={isLoading}
                  required
                />
                <button
                  type="submit"
                  className="email-popup-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      Claim Discount!
                      <i className="fas fa-arrow-right"></i>
                    </>
                  )}
                </button>
                {status === 'error' && errorMessage && (
                  <p className="email-popup-error">{errorMessage}</p>
                )}
              </form>
              <button
                className="email-popup-dismiss"
                onClick={onClose}
              >
                No thanks, I&apos;d rather pay at full price.
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

