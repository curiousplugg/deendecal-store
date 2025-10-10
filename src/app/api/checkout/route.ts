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
    
    // Validate and sanitize environment variables
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
    
    if (!stripeSecretKey) {
      console.error('❌ STRIPE_SECRET_KEY is not set');
      return NextResponse.json({ error: 'Stripe configuration error' }, { status: 500 });
    }
    
    if (!stripePublishableKey) {
      console.error('❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
      return NextResponse.json({ error: 'Stripe configuration error' }, { status: 500 });
    }

    // Validate Stripe key format
    if (!stripeSecretKey.startsWith('sk_')) {
      console.error('❌ Invalid Stripe secret key format');
      return NextResponse.json({ error: 'Invalid Stripe configuration' }, { status: 500 });
    }

    if (!stripePublishableKey.startsWith('pk_')) {
      console.error('❌ Invalid Stripe publishable key format');
      return NextResponse.json({ error: 'Invalid Stripe configuration' }, { status: 500 });
    }

    // Validate Stripe instance
    if (!stripe) {
      console.error('❌ Stripe is not configured');
      return NextResponse.json({ error: 'Stripe configuration error' }, { status: 500 });
    }

    // Check for invalid characters in the API key
    const invalidChars = /[^\x20-\x7E]/;
    if (invalidChars.test(stripeSecretKey)) {
      console.error('❌ Stripe secret key contains invalid characters');
      return NextResponse.json({ error: 'Invalid Stripe configuration' }, { status: 500 });
    }
    
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
      return NextResponse.json({ error: 'Stripe connection failed' }, { status: 500 });
    }
    
    const { items } = await req.json();
    console.log('📦 Items:', JSON.stringify(items, null, 2));

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('❌ No items provided for checkout');
      return NextResponse.json({ error: 'No items provided for checkout' }, { status: 400 });
    }

    // Validate each item has required fields
    for (const item of items) {
      if (!item.selectedColor || !item.quantity || item.quantity <= 0) {
        console.error('❌ Invalid item:', item);
        return NextResponse.json({ error: 'Invalid item data' }, { status: 400 });
      }
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

    // Create Stripe checkout session with comprehensive error handling
    const sessionConfig = {
      line_items: lineItems,
      mode: 'payment' as const,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: metadata,
      allow_promotion_codes: true,
      custom_fields: [
        {
          key: 'special_instructions',
          label: {
            type: 'custom' as const,
            custom: 'Special Instructions (Optional)'
          },
          type: 'text' as const,
          optional: true
        }
      ],
      shipping_address_collection: {
        allowed_countries: [
          'AC', 'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CV', 'CW', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MK', 'ML', 'MM', 'MN', 'MO', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SZ', 'TA', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VN', 'VU', 'WF', 'WS', 'XK', 'YE', 'YT', 'ZA', 'ZM', 'ZW', 'ZZ'
        ]
      },
      phone_number_collection: {
        enabled: true
      }
    };

    console.log('🛒 Creating Stripe session with config:', JSON.stringify(sessionConfig, null, 2));

    const session = await stripe.checkout.sessions.create(sessionConfig as Parameters<typeof stripe.checkout.sessions.create>[0]);

    console.log('✅ Checkout session created:', session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    
    // Handle specific Stripe errors
    if (error instanceof Error) {
      if (error.message.includes('Invalid price ID')) {
        return NextResponse.json({ 
          error: 'Invalid product configuration',
          details: error.message
        }, { status: 400 });
      }
      
      if (error.message.includes('No such price')) {
        return NextResponse.json({ 
          error: 'Product not found in Stripe',
          details: 'The selected product is not available'
        }, { status: 400 });
      }
      
      if (error.message.includes('Invalid API key')) {
        return NextResponse.json({ 
          error: 'Payment system configuration error',
          details: 'Please try again later'
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Checkout failed',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}
