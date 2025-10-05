import Stripe from 'stripe';

// Sanitize and validate the Stripe secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

// Check for invalid characters that could cause header issues
const invalidChars = /[^\x20-\x7E]/;
if (invalidChars.test(stripeSecretKey)) {
  throw new Error('STRIPE_SECRET_KEY contains invalid characters');
}

// Validate key format
if (!stripeSecretKey.startsWith('sk_')) {
  throw new Error('Invalid Stripe secret key format');
}

export const stripe = new Stripe(stripeSecretKey, {
  typescript: true,
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
