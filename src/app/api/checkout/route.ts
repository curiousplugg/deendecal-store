import { NextRequest, NextResponse } from 'next/server';
import { stripe, formatAmountForStripe } from '@/lib/stripe';

// Stripe price IDs for each color variant (LIVE MODE)
const PRICE_IDS = {
  'Gold': 'price_1SBkbeBJjaZO6BBgJD1bAJvt',
  'Black': 'price_1SBkbeBJjaZO6BBgkuwcTysc', 
  'Red': 'price_1SBkbeBJjaZO6BBgUjC7X59s',
  'Silver': 'price_1SBkbeBJjaZO6BBgbNls06pg'
};

export async function POST(req: NextRequest) {
  try {
    const { items, customerEmail } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided for checkout' }, { status: 400 });
    }

    // Create Stripe checkout session using existing price IDs
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: { name: string; description: string; price: number; image: string; quantity: number; selectedColor?: string }) => {
        const priceId = PRICE_IDS[item.selectedColor as keyof typeof PRICE_IDS] || PRICE_IDS['Gold'];
        return {
          price: priceId,
          quantity: item.quantity,
        };
      }),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      customer_email: customerEmail,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 });
  }
}
