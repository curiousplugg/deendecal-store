'use client';

import React, { useState } from 'react';
import { track } from '@vercel/analytics';

export default function FooterEmailForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'duplicate'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Email is required');
      setStatus('error');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setMessage('');

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
          setMessage('Already subscribed! Check your inbox for your discount code.');
          track('Footer Email Subscription', { status: 'duplicate' });
        } else {
          setStatus('success');
          setMessage('Success! Check your email for your 20% off code.');
          track('Footer Email Subscription', { status: 'success' });
        }
        setEmail(''); // Clear input on success
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
        track('Footer Email Subscription', { status: 'error', error: data.error });
      }
    } catch (error) {
      setStatus('error');
      setMessage('Connection failed. Please try again.');
      track('Footer Email Subscription', { status: 'error', error: 'network_error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="footer-email-form">
      <form onSubmit={handleSubmit} className="footer-email-form-container">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') {
              setStatus('idle');
              setMessage('');
            }
          }}
          placeholder="Enter email"
          className="footer-email-input"
          disabled={isLoading}
          required
        />
        <button
          type="submit"
          className="footer-email-submit"
          disabled={isLoading}
          aria-label="Subscribe to email list"
        >
          {isLoading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-arrow-right"></i>
          )}
        </button>
      </form>
      {status !== 'idle' && message && (
        <p className={`footer-email-message ${status === 'error' ? 'footer-email-error' : 'footer-email-success'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

