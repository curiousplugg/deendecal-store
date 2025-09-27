import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// Stripe price IDs for each color variant (LIVE MODE) - Correct IDs from Stripe CLI
const PRICE_IDS = {
  'Gold': 'price_1SBkbeBJjaZO6BBgJD1bAJvt',
  'Black': 'price_1SBkbeBJjaZO6BBgkuwcTysc', 
  'Red': 'price_1SBkbeBJjaZO6BBgUjC7X59s',
  'Silver': 'price_1SBkbeBJjaZO6BBgbNls06pg'
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

    // Create line items for Stripe
    const lineItems = items.map((item: CartItem) => {
      const priceId = PRICE_IDS[item.selectedColor as keyof typeof PRICE_IDS] || PRICE_IDS['Gold'];
      console.log(`🎨 Color: ${item.selectedColor}, Price ID: ${priceId}, Quantity: ${item.quantity}`);
      console.log(`🔍 Available price IDs:`, PRICE_IDS);
      console.log(`🔍 Selected color: "${item.selectedColor}"`);
      
      // Validate price ID format
      if (!priceId.startsWith('price_')) {
        throw new Error(`Invalid price ID: ${priceId}`);
      }
      
      return {
        price: priceId,
        quantity: item.quantity,
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
    
    console.log('🛒 Creating Stripe session with:', {
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl
    });
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

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
