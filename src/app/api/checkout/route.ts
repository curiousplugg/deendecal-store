import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

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
        name: item.name,
        color: item.selectedColor,
        image: item.image,
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
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'LU', 'MT', 'CY', 'EE', 'LV', 'LT', 'SI', 'SK', 'CZ', 'HU', 'PL', 'RO', 'BG', 'HR', 'GR', 'JP', 'KR', 'SG', 'HK', 'NZ', 'MY', 'TH', 'PH', 'AE', 'SA', 'ZA', 'NG', 'EG', 'MX', 'BR', 'AR', 'CL', 'CO', 'JM', 'TT', 'BB', 'BS', 'DO', 'HT', 'PR', 'VI', 'IS', 'FJ', 'PG', 'VU', 'SB', 'PK', 'PA', 'PY', 'PS', 'PW']
      },
      phone_number_collection: {
        enabled: true
      }
    } as Stripe.Checkout.SessionCreateParams);

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
