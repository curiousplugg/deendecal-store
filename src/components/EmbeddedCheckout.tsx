'use client';

import React, { useEffect, useState, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
let stripePromise: Promise<any> | null = null;

const getStripePromise = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

interface EmbeddedCheckoutComponentProps {
  items: Array<{
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  }>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// Checkout form component that handles payment submission
function CheckoutForm({ onSuccess, onError }: { onSuccess?: () => void; onError?: (error: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<string>('');
  
  // Check for existing applied coupon on mount
  useEffect(() => {
    const existingCoupon = localStorage.getItem('appliedCoupon');
    if (existingCoupon) {
      setAppliedCoupon(existingCoupon);
      setCouponSuccess(`Coupon "${existingCoupon}" is applied`);
    }
  }, []);
  
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    phone: '',
    address: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    notes: ''
  });

  // Country-specific address configurations
  const getCountryConfig = (countryCode: string) => {
    const configs: { [key: string]: any } = {
      'US': { stateLabel: 'State', statePlaceholder: 'Enter your state', zipLabel: 'ZIP Code', zipPlaceholder: 'Enter your ZIP code', zipPattern: '[0-9]{5}(-[0-9]{4})?', zipMaxLength: 10 },
      'CA': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[A-Za-z][0-9][A-Za-z] [0-9][A-Za-z][0-9]', zipMaxLength: 7 },
      'GB': { stateLabel: 'County', statePlaceholder: 'Enter your county', zipLabel: 'Postcode', zipPlaceholder: 'Enter your postcode', zipPattern: '[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][A-Z]{2}', zipMaxLength: 8 },
      'AU': { stateLabel: 'State/Territory', statePlaceholder: 'Enter your state', zipLabel: 'Postcode', zipPlaceholder: 'Enter your postcode', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'DE': { stateLabel: 'State', statePlaceholder: 'Enter your state', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'FR': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'IT': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5, zipFirst: true },
      'ES': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'NL': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4} [A-Z]{2}', zipMaxLength: 7 },
      'BE': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'CH': { stateLabel: 'Canton', statePlaceholder: 'Enter your canton', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'AT': { stateLabel: 'State', statePlaceholder: 'Enter your state', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'SE': { stateLabel: 'County', statePlaceholder: 'Enter your county', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{3} [0-9]{2}', zipMaxLength: 6 },
      'NO': { stateLabel: 'County', statePlaceholder: 'Enter your county', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'DK': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'FI': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'IE': { stateLabel: 'County', statePlaceholder: 'Enter your county', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[A-Z0-9]{3,4} [A-Z0-9]{3,4}', zipMaxLength: 8 },
      'PT': { stateLabel: 'District', statePlaceholder: 'Enter your district', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}-[0-9]{3}', zipMaxLength: 8 },
      'GR': { stateLabel: 'Prefecture', statePlaceholder: 'Enter your prefecture', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{3} [0-9]{2}', zipMaxLength: 6 },
      'PL': { stateLabel: 'Voivodeship', statePlaceholder: 'Enter your voivodeship', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{2}-[0-9]{3}', zipMaxLength: 6, zipFirst: true },
      'CZ': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{3} [0-9]{2}', zipMaxLength: 6 },
      'HU': { stateLabel: 'County', statePlaceholder: 'Enter your county', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'RO': { stateLabel: 'County', statePlaceholder: 'Enter your county', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{6}', zipMaxLength: 6 },
      'BG': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'HR': { stateLabel: 'County', statePlaceholder: 'Enter your county', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'SI': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'SK': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{3} [0-9]{2}', zipMaxLength: 6 },
      'LT': { stateLabel: 'County', statePlaceholder: 'Enter your county', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'LV': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[A-Z]{2}-[0-9]{4}', zipMaxLength: 7 },
      'EE': { stateLabel: 'County', statePlaceholder: 'Enter your county', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5, zipFirst: true },
      'CY': { stateLabel: 'District', statePlaceholder: 'Enter your district', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'LU': { stateLabel: 'Canton', statePlaceholder: 'Enter your canton', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'MT': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[A-Z]{3} [0-9]{4}', zipMaxLength: 8 },
      'JP': { stateLabel: 'Prefecture', statePlaceholder: 'Enter your prefecture', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{3}-[0-9]{4}', zipMaxLength: 8 },
      'KR': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'CN': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{6}', zipMaxLength: 6 },
      'IN': { stateLabel: 'State', statePlaceholder: 'Enter your state', zipLabel: 'PIN Code', zipPlaceholder: 'Enter your PIN code', zipPattern: '[0-9]{6}', zipMaxLength: 6 },
      'BR': { stateLabel: 'State', statePlaceholder: 'Enter your state', zipLabel: 'CEP', zipPlaceholder: 'Enter your CEP', zipPattern: '[0-9]{5}-[0-9]{3}', zipMaxLength: 9 },
      'MX': { stateLabel: 'State', statePlaceholder: 'Enter your state', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'AR': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[A-Z][0-9]{4}[A-Z]{3}', zipMaxLength: 8 },
      'CL': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{7}', zipMaxLength: 7 },
      'CO': { stateLabel: 'Department', statePlaceholder: 'Enter your department', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{6}', zipMaxLength: 6 },
      'PE': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'VE': { stateLabel: 'State', statePlaceholder: 'Enter your state', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'ZA': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'NG': { stateLabel: 'State', statePlaceholder: 'Enter your state', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{6}', zipMaxLength: 6 },
      'EG': { stateLabel: 'Governorate', statePlaceholder: 'Enter your governorate', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'MA': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'TN': { stateLabel: 'Governorate', statePlaceholder: 'Enter your governorate', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'DZ': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'LY': { stateLabel: 'District', statePlaceholder: 'Enter your district', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'SD': { stateLabel: 'State', statePlaceholder: 'Enter your state', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'ET': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'KE': { stateLabel: 'County', statePlaceholder: 'Enter your county', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'GH': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[A-Z]{2}[0-9]{4}', zipMaxLength: 6 },
      'UG': { stateLabel: 'District', statePlaceholder: 'Enter your district', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'TZ': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'RW': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'BI': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'DJ': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'SO': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'ER': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'SS': { stateLabel: 'State', statePlaceholder: 'Enter your state', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'CF': { stateLabel: 'Prefecture', statePlaceholder: 'Enter your prefecture', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'TD': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'CM': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'GQ': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'GA': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'CG': { stateLabel: 'Department', statePlaceholder: 'Enter your department', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'CD': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'AO': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'ZM': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'ZW': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'BW': { stateLabel: 'District', statePlaceholder: 'Enter your district', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'NA': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'SZ': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[A-Z]{1}[0-9]{3}', zipMaxLength: 4 },
      'LS': { stateLabel: 'District', statePlaceholder: 'Enter your district', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{3}', zipMaxLength: 3 },
      'MG': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{3}', zipMaxLength: 3 },
      'MU': { stateLabel: 'District', statePlaceholder: 'Enter your district', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'SC': { stateLabel: 'District', statePlaceholder: 'Enter your district', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'KM': { stateLabel: 'Island', statePlaceholder: 'Enter your island', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'YT': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'RE': { stateLabel: 'Department', statePlaceholder: 'Enter your department', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
      'MZ': { stateLabel: 'Province', statePlaceholder: 'Enter your province', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{4}', zipMaxLength: 4 },
      'MW': { stateLabel: 'Region', statePlaceholder: 'Enter your region', zipLabel: 'Postal Code', zipPlaceholder: 'Enter your postal code', zipPattern: '[0-9]{5}', zipMaxLength: 5 },
    };
    
    return configs[countryCode] || {
      stateLabel: 'State/Province',
      statePlaceholder: 'Enter your state/province',
      zipLabel: 'Postal Code',
      zipPlaceholder: 'Enter your postal code',
      zipPattern: '.*',
      zipMaxLength: 10
    };
  };

  const countryConfig = getCountryConfig(shippingDetails.country);

  const handleCountryChange = (newCountry: string) => {
    setShippingDetails(prev => ({
      ...prev,
      country: newCountry,
      state: '', // Clear state when country changes
      zip: ''    // Clear zip when country changes
    }));
  };

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    // Check if a coupon is already applied
    if (appliedCoupon) {
      setCouponError('A coupon is already applied. Remove the current coupon to apply a new one.');
      return;
    }

    try {
      // Validate coupon with Stripe
      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ couponCode: couponCode.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to validate coupon');
      }

      const data = await response.json();
      
      if (data.valid) {
        setAppliedCoupon(couponCode.trim());
        setCouponSuccess(`Coupon "${couponCode}" applied! ${data.discountText}`);
        setCouponDiscount(data.discountText);
        setCouponCode('');
        // Store the coupon for use in payment
        localStorage.setItem('appliedCoupon', couponCode.trim());
      } else {
        setCouponError('Invalid or expired coupon code');
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      setCouponError('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      // Call backend to remove coupon from Stripe
      const response = await fetch('/api/remove-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ couponCode: appliedCoupon }),
      });

      if (response.ok) {
        // Clear coupon state
        setAppliedCoupon(null);
        setCouponSuccess('');
        setCouponDiscount('');
        setCouponError('');
        setCouponCode('');
        
        // Remove from localStorage
        localStorage.removeItem('appliedCoupon');
      } else {
        setCouponError('Failed to remove coupon. Please try again.');
      }
    } catch (error) {
      console.error('Error removing coupon:', error);
      setCouponError('Failed to remove coupon. Please try again.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
          payment_method_data: {
            billing_details: {
              name: shippingDetails.name,
              phone: shippingDetails.phone,
              address: {
                line1: shippingDetails.address,
                line2: shippingDetails.addressLine2,
                city: shippingDetails.city,
                state: shippingDetails.state,
                postal_code: shippingDetails.zip,
                country: shippingDetails.country,
              },
            },
          },
        },
      });

    if (error) {
      console.error('Payment failed:', error);
      onError?.(error.message || 'Payment failed');
    } else {
      console.log('Payment succeeded!');
      onSuccess?.();
    }
    } catch (err) {
      console.error('Payment error:', err);
      onError?.('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Coupon Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <button
          type="button"
          onClick={() => setShowCoupon(!showCoupon)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-sm font-medium text-gray-700">
            <i className="fas fa-tag mr-2"></i>
            Have a coupon code?
          </span>
          <i className={`fas fa-chevron-${showCoupon ? 'up' : 'down'} text-gray-400`}></i>
        </button>
        
        {showCoupon && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {/* Applied Coupon Display */}
            {appliedCoupon ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-check-circle text-green-600"></i>
                    <span className="text-green-800 font-medium">Coupon Applied: {appliedCoupon}</span>
                    {couponDiscount && (
                      <span className="text-green-600 text-sm">({couponDiscount})</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-red-600 hover:text-red-800 transition-colors p-1"
                    title="Remove coupon"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            ) : (
              /* Coupon Input Form */
              <form onSubmit={handleCouponSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                  >
                    Apply
                  </button>
                </div>
                
                {couponError && (
                  <div className="text-red-600 text-sm flex items-center">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {couponError}
                  </div>
                )}
                
                {couponSuccess && (
                  <div className="text-green-600 text-sm flex items-center">
                    <i className="fas fa-check-circle mr-2"></i>
                    {couponSuccess}
                  </div>
                )}
              </form>
            )}
          </div>
        )}
      </div>

      {/* Shipping Details */}
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i className="fas fa-shipping-fast mr-2 text-blue-600"></i>
          Shipping Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Row 1: Full Name, Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={shippingDetails.name}
              onChange={(e) => setShippingDetails(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              value={shippingDetails.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="AC">Ascension Island</option>
              <option value="AD">Andorra</option>
              <option value="AE">United Arab Emirates</option>
              <option value="AF">Afghanistan</option>
              <option value="AG">Antigua and Barbuda</option>
              <option value="AI">Anguilla</option>
              <option value="AL">Albania</option>
              <option value="AM">Armenia</option>
              <option value="AO">Angola</option>
              <option value="AQ">Antarctica</option>
              <option value="AR">Argentina</option>
              <option value="AS">American Samoa</option>
              <option value="AT">Austria</option>
              <option value="AU">Australia</option>
              <option value="AW">Aruba</option>
              <option value="AX">Åland Islands</option>
              <option value="AZ">Azerbaijan</option>
              <option value="BA">Bosnia and Herzegovina</option>
              <option value="BB">Barbados</option>
              <option value="BD">Bangladesh</option>
              <option value="BE">Belgium</option>
              <option value="BF">Burkina Faso</option>
              <option value="BG">Bulgaria</option>
              <option value="BH">Bahrain</option>
              <option value="BI">Burundi</option>
              <option value="BJ">Benin</option>
              <option value="BL">Saint Barthélemy</option>
              <option value="BM">Bermuda</option>
              <option value="BN">Brunei</option>
              <option value="BO">Bolivia</option>
              <option value="BQ">Caribbean Netherlands</option>
              <option value="BR">Brazil</option>
              <option value="BS">Bahamas</option>
              <option value="BT">Bhutan</option>
              <option value="BV">Bouvet Island</option>
              <option value="BW">Botswana</option>
              <option value="BY">Belarus</option>
              <option value="BZ">Belize</option>
              <option value="CA">Canada</option>
              <option value="CC">Cocos Islands</option>
              <option value="CD">Democratic Republic of the Congo</option>
              <option value="CF">Central African Republic</option>
              <option value="CG">Republic of the Congo</option>
              <option value="CH">Switzerland</option>
              <option value="CI">Côte d'Ivoire</option>
              <option value="CK">Cook Islands</option>
              <option value="CL">Chile</option>
              <option value="CM">Cameroon</option>
              <option value="CN">China</option>
              <option value="CO">Colombia</option>
              <option value="CR">Costa Rica</option>
              <option value="CU">Cuba</option>
              <option value="CV">Cape Verde</option>
              <option value="CW">Curaçao</option>
              <option value="CX">Christmas Island</option>
              <option value="CY">Cyprus</option>
              <option value="CZ">Czech Republic</option>
              <option value="DE">Germany</option>
              <option value="DJ">Djibouti</option>
              <option value="DK">Denmark</option>
              <option value="DM">Dominica</option>
              <option value="DO">Dominican Republic</option>
              <option value="DZ">Algeria</option>
              <option value="EC">Ecuador</option>
              <option value="EE">Estonia</option>
              <option value="EG">Egypt</option>
              <option value="EH">Western Sahara</option>
              <option value="ER">Eritrea</option>
              <option value="ES">Spain</option>
              <option value="ET">Ethiopia</option>
              <option value="FI">Finland</option>
              <option value="FJ">Fiji</option>
              <option value="FK">Falkland Islands</option>
              <option value="FM">Micronesia</option>
              <option value="FO">Faroe Islands</option>
              <option value="FR">France</option>
              <option value="GA">Gabon</option>
              <option value="GB">United Kingdom</option>
              <option value="GD">Grenada</option>
              <option value="GE">Georgia</option>
              <option value="GF">French Guiana</option>
              <option value="GG">Guernsey</option>
              <option value="GH">Ghana</option>
              <option value="GI">Gibraltar</option>
              <option value="GL">Greenland</option>
              <option value="GM">Gambia</option>
              <option value="GN">Guinea</option>
              <option value="GP">Guadeloupe</option>
              <option value="GQ">Equatorial Guinea</option>
              <option value="GR">Greece</option>
              <option value="GS">South Georgia and the South Sandwich Islands</option>
              <option value="GT">Guatemala</option>
              <option value="GU">Guam</option>
              <option value="GW">Guinea-Bissau</option>
              <option value="GY">Guyana</option>
              <option value="HK">Hong Kong</option>
              <option value="HM">Heard Island and McDonald Islands</option>
              <option value="HN">Honduras</option>
              <option value="HR">Croatia</option>
              <option value="HT">Haiti</option>
              <option value="HU">Hungary</option>
              <option value="ID">Indonesia</option>
              <option value="IE">Ireland</option>
              <option value="IL">Israel</option>
              <option value="IM">Isle of Man</option>
              <option value="IN">India</option>
              <option value="IO">British Indian Ocean Territory</option>
              <option value="IQ">Iraq</option>
              <option value="IR">Iran</option>
              <option value="IS">Iceland</option>
              <option value="IT">Italy</option>
              <option value="JE">Jersey</option>
              <option value="JM">Jamaica</option>
              <option value="JO">Jordan</option>
              <option value="JP">Japan</option>
              <option value="KE">Kenya</option>
              <option value="KG">Kyrgyzstan</option>
              <option value="KH">Cambodia</option>
              <option value="KI">Kiribati</option>
              <option value="KM">Comoros</option>
              <option value="KN">Saint Kitts and Nevis</option>
              <option value="KP">North Korea</option>
              <option value="KR">South Korea</option>
              <option value="KW">Kuwait</option>
              <option value="KY">Cayman Islands</option>
              <option value="KZ">Kazakhstan</option>
              <option value="LA">Laos</option>
              <option value="LB">Lebanon</option>
              <option value="LC">Saint Lucia</option>
              <option value="LI">Liechtenstein</option>
              <option value="LK">Sri Lanka</option>
              <option value="LR">Liberia</option>
              <option value="LS">Lesotho</option>
              <option value="LT">Lithuania</option>
              <option value="LU">Luxembourg</option>
              <option value="LV">Latvia</option>
              <option value="LY">Libya</option>
              <option value="MA">Morocco</option>
              <option value="MC">Monaco</option>
              <option value="MD">Moldova</option>
              <option value="ME">Montenegro</option>
              <option value="MF">Saint Martin</option>
              <option value="MG">Madagascar</option>
              <option value="MH">Marshall Islands</option>
              <option value="MK">North Macedonia</option>
              <option value="ML">Mali</option>
              <option value="MM">Myanmar</option>
              <option value="MN">Mongolia</option>
              <option value="MO">Macao</option>
              <option value="MP">Northern Mariana Islands</option>
              <option value="MQ">Martinique</option>
              <option value="MR">Mauritania</option>
              <option value="MS">Montserrat</option>
              <option value="MT">Malta</option>
              <option value="MU">Mauritius</option>
              <option value="MV">Maldives</option>
              <option value="MW">Malawi</option>
              <option value="MX">Mexico</option>
              <option value="MY">Malaysia</option>
              <option value="MZ">Mozambique</option>
              <option value="NA">Namibia</option>
              <option value="NC">New Caledonia</option>
              <option value="NE">Niger</option>
              <option value="NF">Norfolk Island</option>
              <option value="NG">Nigeria</option>
              <option value="NI">Nicaragua</option>
              <option value="NL">Netherlands</option>
              <option value="NO">Norway</option>
              <option value="NP">Nepal</option>
              <option value="NR">Nauru</option>
              <option value="NU">Niue</option>
              <option value="NZ">New Zealand</option>
              <option value="OM">Oman</option>
              <option value="PA">Panama</option>
              <option value="PE">Peru</option>
              <option value="PF">French Polynesia</option>
              <option value="PG">Papua New Guinea</option>
              <option value="PH">Philippines</option>
              <option value="PK">Pakistan</option>
              <option value="PL">Poland</option>
              <option value="PM">Saint Pierre and Miquelon</option>
              <option value="PN">Pitcairn Islands</option>
              <option value="PR">Puerto Rico</option>
              <option value="PS">Palestine</option>
              <option value="PT">Portugal</option>
              <option value="PW">Palau</option>
              <option value="PY">Paraguay</option>
              <option value="QA">Qatar</option>
              <option value="RE">Réunion</option>
              <option value="RO">Romania</option>
              <option value="RS">Serbia</option>
              <option value="RU">Russia</option>
              <option value="RW">Rwanda</option>
              <option value="SA">Saudi Arabia</option>
              <option value="SB">Solomon Islands</option>
              <option value="SC">Seychelles</option>
              <option value="SD">Sudan</option>
              <option value="SE">Sweden</option>
              <option value="SG">Singapore</option>
              <option value="SH">Saint Helena</option>
              <option value="SI">Slovenia</option>
              <option value="SJ">Svalbard and Jan Mayen</option>
              <option value="SK">Slovakia</option>
              <option value="SL">Sierra Leone</option>
              <option value="SM">San Marino</option>
              <option value="SN">Senegal</option>
              <option value="SO">Somalia</option>
              <option value="SR">Suriname</option>
              <option value="SS">South Sudan</option>
              <option value="ST">São Tomé and Príncipe</option>
              <option value="SV">El Salvador</option>
              <option value="SX">Sint Maarten</option>
              <option value="SY">Syria</option>
              <option value="SZ">Eswatini</option>
              <option value="TC">Turks and Caicos Islands</option>
              <option value="TD">Chad</option>
              <option value="TF">French Southern Territories</option>
              <option value="TG">Togo</option>
              <option value="TH">Thailand</option>
              <option value="TJ">Tajikistan</option>
              <option value="TK">Tokelau</option>
              <option value="TL">Timor-Leste</option>
              <option value="TM">Turkmenistan</option>
              <option value="TN">Tunisia</option>
              <option value="TO">Tonga</option>
              <option value="TR">Turkey</option>
              <option value="TT">Trinidad and Tobago</option>
              <option value="TV">Tuvalu</option>
              <option value="TW">Taiwan</option>
              <option value="TZ">Tanzania</option>
              <option value="UA">Ukraine</option>
              <option value="UG">Uganda</option>
              <option value="UM">United States Minor Outlying Islands</option>
              <option value="US">United States</option>
              <option value="UY">Uruguay</option>
              <option value="UZ">Uzbekistan</option>
              <option value="VA">Vatican City</option>
              <option value="VC">Saint Vincent and the Grenadines</option>
              <option value="VE">Venezuela</option>
              <option value="VG">British Virgin Islands</option>
              <option value="VI">United States Virgin Islands</option>
              <option value="VN">Vietnam</option>
              <option value="VU">Vanuatu</option>
              <option value="WF">Wallis and Futuna</option>
              <option value="WS">Samoa</option>
              <option value="XK">Kosovo</option>
              <option value="YE">Yemen</option>
              <option value="YT">Mayotte</option>
              <option value="ZA">South Africa</option>
              <option value="ZM">Zambia</option>
              <option value="ZW">Zimbabwe</option>
              <option value="ZZ">Unknown or Invalid Territory</option>
            </select>
          </div>
          
          {/* Row 2: Street Address, Apartment/Unit Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              value={shippingDetails.address}
              onChange={(e) => setShippingDetails(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your street address"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apartment/Unit Number
            </label>
            <input
              type="text"
              value={shippingDetails.addressLine2}
              onChange={(e) => setShippingDetails(prev => ({ ...prev, addressLine2: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Apt, Suite, Unit, etc. (optional)"
            />
          </div>
          
          {/* Row 3: State, City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {countryConfig.stateLabel} *
            </label>
            <input
              type="text"
              value={shippingDetails.state}
              onChange={(e) => setShippingDetails(prev => ({ ...prev, state: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={countryConfig.statePlaceholder}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              value={shippingDetails.city}
              onChange={(e) => setShippingDetails(prev => ({ ...prev, city: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your city"
              required
            />
          </div>
          
          {/* Row 4: ZIP Code, Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {countryConfig.zipLabel} *
            </label>
            <input
              type="text"
              value={shippingDetails.zip}
              onChange={(e) => setShippingDetails(prev => ({ ...prev, zip: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={countryConfig.zipPlaceholder}
              pattern={countryConfig.zipPattern}
              maxLength={countryConfig.zipMaxLength}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              value={shippingDetails.phone}
              onChange={(e) => setShippingDetails(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your phone number"
              required
            />
          </div>
        </div>
        
        {/* Additional Shipping Notes */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Shipping Information
          </label>
          <textarea
            value={shippingDetails.notes || ''}
            onChange={(e) => setShippingDetails(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any specific delivery instructions, area details, or additional information for shipping (optional)"
            rows={3}
          />
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement />
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {isProcessing ? 'Processing...' : 'Complete Purchase'}
        </button>
      </form>
    </div>
  );
}

export default function EmbeddedCheckoutComponent({ 
  items, 
  onSuccess, 
  onError 
}: EmbeddedCheckoutComponentProps) {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasCreatedCheckout = useRef(false);

  useEffect(() => {
    // Prevent multiple checkout creation
    if (hasCreatedCheckout.current) return;
    
    // Create checkout session and get client secret
    const createCheckoutSession = async () => {
      try {
        // Get applied coupon from localStorage
        const appliedCoupon = localStorage.getItem('appliedCoupon');
        
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            items, 
            embedded: true, 
            couponCode: appliedCoupon 
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ Checkout API Error:', errorData);
          throw new Error(errorData.error || 'Failed to create checkout session');
        }

        const data = await response.json();
        
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          hasCreatedCheckout.current = true;
        } else {
          throw new Error('No client secret received from server');
        }
      } catch (err) {
        console.error('❌ Embedded Checkout Error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    createCheckoutSession();
  }, [onError]);

  const options = {
    clientSecret,
    onComplete: () => {
      onSuccess?.();
    },
    fields: {
      billingDetails: 'auto',
    },
    terms: {
      card: 'auto',
    },
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
      radios: false,
      spacedAccordionItems: false
    },
    business: {
      name: 'Deen Decal'
    },
    wallets: {
      applePay: 'auto',
      googlePay: 'auto'
    },
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Ideal Sans, system-ui, sans-serif',
        spacingUnit: '2px',
        borderRadius: '4px',
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fas fa-exclamation-circle text-red-400"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Checkout Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="embedded-checkout-container">
      <Elements stripe={getStripePromise()} options={options}>
        <CheckoutForm onSuccess={onSuccess} onError={onError} />
      </Elements>
    </div>
  );
}