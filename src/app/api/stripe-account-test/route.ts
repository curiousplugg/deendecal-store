import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET() {
  try {
    console.log('🔍 Testing Stripe account status...');
    
    // Test 1: Get account details
    const account = await stripe.accounts.retrieve();
    console.log('📊 Account details:', {
      id: account.id,
      country: account.country,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
      capabilities: account.capabilities
    });
    
    // Test 2: List products to verify they exist
    const products = await stripe.products.list({ limit: 10 });
    console.log('📦 Products found:', products.data.length);
    
    // Test 3: List prices to verify they exist
    const prices = await stripe.prices.list({ limit: 10 });
    console.log('💰 Prices found:', prices.data.length);
    
    // Test 4: Check if our specific price IDs exist
    const priceIds = [
      'price_1SBkbeBJjaZ06BBgJD1bAJvt', // Gold
      'price_1SBkbeBJjaZ06BBgkuwcTysc', // Black
      'price_1SBkbeBJjaZ06BBgUjC7X59s', // Red
      'price_1SBkbeBJjaZ06BBgbNls06pg'  // Silver
    ];
    
    const priceResults = [];
    for (const priceId of priceIds) {
      try {
        const price = await stripe.prices.retrieve(priceId);
        priceResults.push({
          id: priceId,
          exists: true,
          active: price.active,
          unit_amount: price.unit_amount,
          currency: price.currency
        });
      } catch (error) {
        priceResults.push({
          id: priceId,
          exists: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        country: account.country,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
        capabilities: account.capabilities
      },
      products_count: products.data.length,
      prices_count: prices.data.length,
      price_verification: priceResults
    });
  } catch (error) {
    console.error('❌ Stripe account test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      type: error instanceof Error ? error.constructor.name : typeof error
    }, { status: 500 });
  }
}
