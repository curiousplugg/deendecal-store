import Stripe from 'stripe';

// Sanitize and validate the Stripe secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

// Only validate and create Stripe instance if we're not in build time
let stripe: Stripe | null = null;

if (stripeSecretKey) {
  // Check for invalid characters that could cause header issues
  const invalidChars = /[^\x20-\x7E]/;
  if (invalidChars.test(stripeSecretKey)) {
    throw new Error('STRIPE_SECRET_KEY contains invalid characters');
  }

  // Validate key format
  if (!stripeSecretKey.startsWith('sk_')) {
    throw new Error('Invalid Stripe secret key format');
  }

  stripe = new Stripe(stripeSecretKey, {
    typescript: true,
  });
}

export { stripe };

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
