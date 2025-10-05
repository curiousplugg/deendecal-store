import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = () => {
  if (!stripePromise) {
    // Sanitize and validate the publishable key
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
    
    if (!publishableKey) {
      throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
    }

    // Check for invalid characters
    const invalidChars = /[^\x20-\x7E]/;
    if (invalidChars.test(publishableKey)) {
      throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY contains invalid characters');
    }

    // Validate key format
    if (!publishableKey.startsWith('pk_')) {
      throw new Error('Invalid Stripe publishable key format');
    }

    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export default getStripe;
