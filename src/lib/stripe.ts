import Stripe from 'stripe';

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (stripeInstance) {
    return stripeInstance;
  }

  // Only validate at runtime, not during build
  // During build, environment variables may not be available
  if (typeof window !== 'undefined') {
    throw new Error('Stripe should only be used on the server');
  }

  // Skip validation during build (when NEXT_PHASE is 'phase-production-build')
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                      process.env.NODE_ENV === 'production' && !process.env.VERCEL;

  // Sanitize and validate the Stripe secret key
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

  // During build, create a dummy instance if key is not available
  if (!stripeSecretKey) {
    if (isBuildTime) {
      // Return a dummy instance during build to avoid errors
      stripeInstance = new Stripe('sk_test_dummy_key_for_build_time_only', {
        typescript: true,
      });
      return stripeInstance;
    }
    throw new Error('STRIPE_SECRET_KEY is not set');
  }

  // Check for invalid characters that could cause header issues
  const invalidChars = /[^\x20-\x7E]/;
  if (invalidChars.test(stripeSecretKey)) {
    throw new Error('STRIPE_SECRET_KEY contains invalid characters');
  }

  // Validate key format (skip during build if using dummy key)
  if (!stripeSecretKey.startsWith('sk_') && !isBuildTime) {
    throw new Error('Invalid Stripe secret key format');
  }

  stripeInstance = new Stripe(stripeSecretKey, {
    typescript: true,
  });

  return stripeInstance;
}

// Export a proxy that lazily initializes Stripe only when accessed
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const instance = getStripe();
    const value = instance[prop as keyof Stripe];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
});

export const formatAmountForDisplay = (
  amount: number,
  currency: string
): string => {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  return numberFormat.format(amount);
};

export const formatAmountForStripe = (
  amount: number,
  currency: string
): number => {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency: boolean = true;
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
};
