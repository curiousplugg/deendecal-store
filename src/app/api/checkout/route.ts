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
    const { items, customerEmail } = await req.json();
    console.log('📦 Items:', JSON.stringify(items, null, 2));
    console.log('📧 Customer email:', customerEmail);

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('❌ No items provided for checkout');
      return NextResponse.json({ error: 'No items provided for checkout' }, { status: 400 });
    }

    // Create Stripe checkout session using existing price IDs
    console.log('🛒 Creating Stripe checkout session...');
    const lineItems = items.map((item: CartItem) => {
      const priceId = PRICE_IDS[item.selectedColor as keyof typeof PRICE_IDS] || PRICE_IDS['Gold'];
      console.log(`🎨 Color: ${item.selectedColor}, Price ID: ${priceId}, Quantity: ${item.quantity}`);
      return {
        price: priceId,
        quantity: item.quantity,
      };
    });
    
    console.log('📋 Line items:', JSON.stringify(lineItems, null, 2));
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      customer_email: customerEmail,
    });

    console.log('✅ Checkout session created:', session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Check if it's a Stripe error
    if (error && typeof error === 'object' && 'type' in error) {
      const stripeError = error as { type: string; code?: string; message?: string };
      console.error('Stripe error type:', stripeError.type);
      console.error('Stripe error code:', stripeError.code);
      console.error('Stripe error message:', stripeError.message);
    }
    
    return NextResponse.json({ 
      error: 'Error creating checkout session',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
