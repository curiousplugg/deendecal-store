import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// Stripe price IDs for each color variant (LIVE MODE) - Updated to match Stripe dashboard
const PRICE_IDS = {
  'Gold': 'price_1SBkbeBJjaZ06BBgJD1bAJvt',
  'Black': 'price_1SBkbeBJjaZ06BBgkuwcTysc', 
  'Red': 'price_1SBkbeBJjaZ06BBgUjC7X59s',
  'Silver': 'price_1SBkbeBJjaZ06BBgbNls06pg'
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
    
    // Create properly formatted URLs for Stripe
    const successUrl = 'https://deendecal.com/success?session_id={CHECKOUT_SESSION_ID}';
    const cancelUrl = 'https://deendecal.com/cart';
    
    console.log('🔗 Success URL:', successUrl);
    console.log('🔗 Cancel URL:', cancelUrl);
    
    // Validate URLs before creating session
    try {
      new URL(successUrl.replace('{CHECKOUT_SESSION_ID}', 'test'));
      new URL(cancelUrl);
      console.log('✅ URLs are valid');
    } catch (urlError) {
      console.error('❌ Invalid URL format:', urlError);
      throw new Error('Invalid URL format for Stripe checkout');
    }
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
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
