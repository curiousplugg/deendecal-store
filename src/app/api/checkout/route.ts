import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// Stripe price IDs for each color variant (LIVE MODE) - Separate products for each color
const PRICE_IDS = {
  'Gold': 'price_1SCDmMBJjaZO6BBglBDEdWpB',
  'Black': 'price_1SCDmNBJjaZO6BBgwmbOsk9g', 
  'Red': 'price_1SCDmNBJjaZO6BBgwejHag8d',
  'Silver': 'price_1SCDmOBJjaZO6BBgFh2xylqB'
};

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  colors?: string[];
  selectedColor?: string;
  material?: string;
  size?: string;
  style?: string;
  installationLocation?: string;
  packingSpecifications?: string;
  installationInstructions?: string[];
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 Checkout request received');
    
    // Debug: Check which Stripe account we're using
    console.log('🔑 Stripe Secret Key (first 10 chars):', process.env.STRIPE_SECRET_KEY?.substring(0, 10));
    console.log('🔑 Stripe Publishable Key (first 10 chars):', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 10));
    
    // Test Stripe connection and get account info
    try {
      const account = await stripe.accounts.retrieve();
      console.log('🏢 Stripe Account ID:', account.id);
      console.log('🏢 Stripe Account Type:', account.type);
      console.log('🏢 Stripe Account Country:', account.country);
    } catch (error) {
      console.error('❌ Error getting Stripe account info:', error);
    }
    
    const { items } = await req.json();
    console.log('📦 Items:', JSON.stringify(items, null, 2));

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('❌ No items provided for checkout');
      return NextResponse.json({ error: 'No items provided for checkout' }, { status: 400 });
    }

    // Create line items for Stripe with custom product information
    const lineItems = items.map((item: CartItem) => {
      const priceId = PRICE_IDS[item.selectedColor as keyof typeof PRICE_IDS] || PRICE_IDS['Gold'];
      console.log(`🎨 Color: ${item.selectedColor}, Price ID: ${priceId}, Quantity: ${item.quantity}`);
      console.log(`🖼️ Image: ${item.image}`);
      console.log(`🔍 Available price IDs:`, PRICE_IDS);
      console.log(`🔍 Selected color: "${item.selectedColor}"`);
      
      // Validate price ID format
      if (!priceId.startsWith('price_')) {
        throw new Error(`Invalid price ID: ${priceId}`);
      }
      
      return {
        price: priceId,
        quantity: item.quantity,
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: 10,
        },
      };
    });
    
    console.log('📋 Line items:', JSON.stringify(lineItems, null, 2));
    
    // Create Stripe checkout session with matching API version
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://deendecal.com').trim();
    const successUrl = `${baseUrl}/success`;
    const cancelUrl = `${baseUrl}/cart`;
    
    console.log('🔍 Environment check:', {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      baseUrl,
      successUrl,
      cancelUrl
    });
    
    // Create metadata with product information for Stripe
    const metadata = {
      cart_items: JSON.stringify(items.map(item => ({
        name: "Shahada Decal", // Short name
        color: item.selectedColor,
        quantity: item.quantity,
        price: item.price
      }))),
      total_items: items.reduce((sum, item) => sum + item.quantity, 0).toString(),
      colors: items.map(item => item.selectedColor).join(', ')
    };

    console.log('🛒 Creating Stripe session with:', {
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: metadata
    });

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: metadata,
      allow_promotion_codes: true, // Enable coupon codes
      custom_fields: [
        {
          key: 'special_instructions',
          label: {
            type: 'custom',
            custom: 'Special Instructions (Optional)'
          },
          type: 'text',
          optional: true
        }
      ],
      shipping_address_collection: {
        allowed_countries: [
          // North America
          'US', 'CA', 'MX', 'GT', 'BZ', 'SV', 'HN', 'NI', 'CR', 'PA', 'CU', 'DO', 'HT', 'JM', 'TT', 'BB', 'BS', 'PR', 'VI', 'GU', 'MP', 'AS',
          
          // South America
          'BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'BO', 'PY', 'UY', 'GY', 'SR', 'FK',
          
          // Europe
          'GB', 'IE', 'FR', 'DE', 'IT', 'ES', 'PT', 'NL', 'BE', 'LU', 'CH', 'AT', 'LI', 'MC', 'SM', 'VA', 'AD', 'SE', 'NO', 'DK', 'FI', 'IS', 'PL', 'CZ', 'SK', 'HU', 'RO', 'BG', 'HR', 'SI', 'EE', 'LV', 'LT', 'GR', 'CY', 'MT', 'AL', 'BA', 'MK', 'ME', 'RS', 'UA', 'BY', 'MD', 'RU',
          
          // Asia
          'CN', 'JP', 'KR', 'TW', 'HK', 'MO', 'SG', 'MY', 'TH', 'VN', 'KH', 'LA', 'MM', 'BD', 'IN', 'PK', 'LK', 'MV', 'NP', 'BT', 'MN', 'KZ', 'UZ', 'TM', 'KG', 'TJ', 'AF', 'IR', 'IQ', 'SY', 'JO', 'LB', 'IL', 'PS', 'TR', 'GE', 'AM', 'AZ',
          
          // Middle East & North Africa
          'SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'YE', 'EG', 'LY', 'TN', 'DZ', 'MA', 'SD', 'SS', 'EH',
          
          // Sub-Saharan Africa
          'ZA', 'NG', 'KE', 'UG', 'TZ', 'RW', 'BI', 'DJ', 'ER', 'ET', 'SO', 'ZM', 'ZW', 'BW', 'NA', 'LS', 'SZ', 'MW', 'MZ', 'AO', 'CD', 'CG', 'CM', 'CF', 'TD', 'GQ', 'GA', 'ST', 'KM', 'MG', 'MU', 'SC', 'CV', 'GM', 'SN', 'GN', 'GW', 'SL', 'LR', 'CI', 'BF', 'TG', 'BJ', 'NE', 'ML', 'MR', 'GH',
          
          // Oceania
          'AU', 'NZ', 'FJ', 'PG', 'SB', 'VU', 'NC', 'PF', 'WF', 'KI', 'NR', 'TV', 'WS', 'TO', 'CK', 'NU', 'TK', 'FM', 'MH', 'PW',
          
          // Caribbean
          'AG', 'BS', 'BB', 'DM', 'GD', 'KN', 'LC', 'VC', 'TT', 'JM', 'HT', 'DO', 'CU', 'PR', 'VI', 'BQ', 'CW', 'SX', 'AW', 'AI', 'BM', 'KY', 'VG', 'MS', 'TC'
        ]
      },
      phone_number_collection: {
        enabled: true
      }
    } as Parameters<typeof stripe.checkout.sessions.create>[0]);

    console.log('✅ Checkout session created:', session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    
    return NextResponse.json({ 
      error: 'Error creating checkout session',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
