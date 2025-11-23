'use server'

import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  selectedColor?: string;
}

// Stripe price IDs for each color variant (LIVE MODE - USD)
// Updated to $24.99 on 2025-01-27
const PRICE_IDS_USD = {
  'Gold': 'price_1SCDmMBJjaZO6BBglBDEdWpB',      // prod_T8UlDxb1zIbuXY
  'Silver': 'price_1SCDmOBJjaZO6BBgFh2xylqB',   // prod_T8UlHlRq1EQ4Sy
  'Black': 'price_1SCDmNBJjaZO6BBgwmbOsk9g',    // prod_T8Ul5nZE1pn2SS
  'Red': 'price_1SCDmNBJjaZO6BBgwejHag8d'        // prod_T8Ul4BeAqqpoyx
};

// For Pakistani customers, we'll use USD pricing converted from PKR
// PKR 6,950 ≈ USD 25 (approximate conversion rate)
// Updated to $24.99 on 2025-01-27
const PRICE_IDS_PKR = {
  'Gold': 'price_1SCDmMBJjaZO6BBglBDEdWpB',      // prod_T8UlDxb1zIbuXY
  'Silver': 'price_1SCDmOBJjaZO6BBgFh2xylqB',   // prod_T8UlHlRq1EQ4Sy
  'Black': 'price_1SCDmNBJjaZO6BBgwmbOsk9g',    // prod_T8Ul5nZE1pn2SS
  'Red': 'price_1SCDmNBJjaZO6BBgwejHag8d'        // prod_T8Ul4BeAqqpoyx
};

export async function fetchClientSecret(items: CartItem[]) {
  try {
    // Validate input
    if (!items || items.length === 0) {
      throw new Error('No items provided for checkout');
    }

    // Validate each item has required fields
    for (const item of items) {
      if (!item.id || !item.name || !item.price || !item.quantity) {
        throw new Error('Invalid item data provided');
      }
    }

    const origin = (await headers()).get('origin') || 'http://localhost:3000'
    const isPakistaniVersion = origin.includes('/pk') || items.some(item => item.price === 6950);

    // Choose price IDs based on version
    const priceIds = isPakistaniVersion ? PRICE_IDS_PKR : PRICE_IDS_USD;

    // Validate that we have price IDs
    if (!priceIds || Object.keys(priceIds).length === 0) {
      throw new Error('No price IDs configured');
    }

    // Create line items with validation
    const lineItems = items.map((item) => {
      const priceId = priceIds[item.selectedColor as keyof typeof priceIds] || priceIds['Gold'];
      if (!priceId) {
        throw new Error(`No price ID found for color: ${item.selectedColor}`);
      }
      return {
        price: priceId,
        quantity: item.quantity,
      };
    });

    // Create metadata
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const metadata = {
      cart_items: JSON.stringify(items.map(item => ({
        name: "Shahada Decal",
        color: item.selectedColor,
        quantity: item.quantity,
        price: item.price
      }))),
      total_items: totalItems.toString(),
      colors: items.map(item => item.selectedColor).join(', ')
    };

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: lineItems,
      mode: 'payment',
      return_url: isPakistaniVersion ? `${origin}/pk/return?session_id={CHECKOUT_SESSION_ID}` : `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: metadata,
      allow_promotion_codes: true,
      currency: 'usd',
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: [
          'AC', 'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CV', 'CW', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MK', 'ML', 'MM', 'MN', 'MO', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SZ', 'TA', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VN', 'VU', 'WF', 'WS', 'XK', 'YE', 'YT', 'ZA', 'ZM', 'ZW', 'ZZ'
        ]
      },
      phone_number_collection: {
        enabled: true
      }
    });

    if (!session.client_secret) {
      throw new Error('Failed to create checkout session - no client secret returned');
    }

    return session.client_secret;
  } catch (error) {
    console.error('Error in fetchClientSecret:', error);
    throw new Error(`Failed to create checkout session: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
