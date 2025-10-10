'use client';

import { useEffect } from 'react';

export default function StripePreloader() {
  useEffect(() => {
    // Preload Stripe script for faster loading
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = 'https://js.stripe.com/v3/';
    link.as = 'script';
    document.head.appendChild(link);

    // Also preload the Stripe domain for faster connections
    const dnsLink = document.createElement('link');
    dnsLink.rel = 'dns-prefetch';
    dnsLink.href = '//js.stripe.com';
    document.head.appendChild(dnsLink);

    // Cleanup on unmount
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.head.contains(dnsLink)) {
        document.head.removeChild(dnsLink);
      }
    };
  }, []);

  return null;
}
