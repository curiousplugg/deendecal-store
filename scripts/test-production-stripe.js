const Stripe = require('stripe');

// Test with production environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
  typescript: true,
});

async function testProductionStripe() {
  try {
    console.log('🔍 Testing production Stripe connection...');
    console.log('API Version:', stripe.getApiField('version'));
    
    // Test basic connection
    const account = await stripe.accounts.retrieve();
    console.log('✅ Stripe connection successful');
    console.log('Account ID:', account.id);
    console.log('Live mode:', account.livemode);
    
    // Test price IDs
    const priceIds = {
      'Gold': 'price_1SBkbeBJjaZO6BBgJD1bAJvt',
      'Black': 'price_1SBkbeBJjaZO6BBgkuwcTysc', 
      'Red': 'price_1SBkbeBJjaZO6BBgUjC7X59s',
      'Silver': 'price_1SBkbeBJjaZO6BBgbNls06pg'
    };
    
    console.log('\n🔍 Testing price IDs...');
    for (const [color, priceId] of Object.entries(priceIds)) {
      try {
        const price = await stripe.prices.retrieve(priceId);
        console.log(`✅ ${color} price valid:`, price.nickname, `($${price.unit_amount / 100})`);
      } catch (error) {
        console.error(`❌ ${color} price invalid:`, error.message);
      }
    }
    
    // Test creating a checkout session
    console.log('\n🔍 Testing checkout session creation...');
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price: priceIds['Gold'],
          quantity: 1,
        }],
        mode: 'payment',
        success_url: 'https://deendecal.com/success',
        cancel_url: 'https://deendecal.com/cart',
        // Custom domain configuration (if set)
        ...(process.env.NEXT_PUBLIC_STRIPE_DOMAIN && {
          domain: process.env.NEXT_PUBLIC_STRIPE_DOMAIN
        }),
      });
      console.log('✅ Checkout session created successfully:', session.id);
    } catch (error) {
      console.error('❌ Checkout session creation failed:', error.message);
      console.error('Error details:', error);
    }
    
  } catch (error) {
    console.error('❌ Stripe connection failed:', error.message);
    console.error('Error type:', error.type);
    if (error.type === 'StripeAuthenticationError') {
      console.error('🔑 Check your Stripe secret key');
    }
  }
}

testProductionStripe();
