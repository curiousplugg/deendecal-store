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
const PRICE_IDS_USD = {
  'Gold': 'price_1SCDmMBJjaZO6BBglBDEdWpB',
  'Black': 'price_1SCDmNBJjaZO6BBgwmbOsk9g', 
  'Red': 'price_1SCDmNBJjaZO6BBgwejHag8d',
  'Silver': 'price_1SCDmOBJjaZO6BBgFh2xylqB'
};

// Stripe price IDs for Pakistani version (PKR) - These need to be created in Stripe Dashboard
const PRICE_IDS_PKR = {
  'Gold': 'price_pk_gold_6950', // Replace with actual PKR price ID
  'Black': 'price_pk_black_6950', // Replace with actual PKR price ID
  'Red': 'price_pk_red_6950', // Replace with actual PKR price ID
  'Silver': 'price_pk_silver_6950' // Replace with actual PKR price ID
};

export async function fetchClientSecret(items: CartItem[]) {
  const origin = (await headers()).get('origin') || 'http://localhost:3000'
  const isPakistaniVersion = origin.includes('/pk') || items.some(item => item.price === 6950);

  // Choose price IDs based on version
  const priceIds = isPakistaniVersion ? PRICE_IDS_PKR : PRICE_IDS_USD;

  // Optimize line items creation
  const lineItems = items.map((item) => ({
    price: priceIds[item.selectedColor as keyof typeof priceIds] || priceIds['Gold'],
    quantity: item.quantity,
  }));

  // Optimize metadata creation
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
    return_url: isPakistaniVersion ? `${origin}/pk/return?session_id={CHECKOUT_SESSION_ID}` : `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
    metadata: metadata,
    allow_promotion_codes: true,
    shipping_address_collection: {
      allowed_countries: [
        'AC', 'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CV', 'CW', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MK', 'ML', 'MM', 'MN', 'MO', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SZ', 'TA', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VN', 'VU', 'WF', 'WS', 'XK', 'YE', 'YT', 'ZA', 'ZM', 'ZW', 'ZZ'
      ]
    },
    phone_number_collection: {
      enabled: true
    }
  })

  return session.client_secret
}
