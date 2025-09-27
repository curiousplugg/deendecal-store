import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// Stripe price IDs for each color variant (LIVE MODE)
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
      return {
        price: priceId,
        quantity: item.quantity,
      };
    });
    
    console.log('📋 Line items:', JSON.stringify(lineItems, null, 2));
    
    // Get base URL - hardcode for production to ensure it works
    const baseUrl = 'https://deendecal.com';
    
    console.log('🌐 Base URL:', baseUrl);
    console.log('🌐 NODE_ENV:', process.env.NODE_ENV);
    console.log('🌐 NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      allow_promotion_codes: true,
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
