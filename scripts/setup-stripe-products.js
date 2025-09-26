const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function setupStripeProducts() {
  try {
    console.log('🚀 Setting up Stripe products...');

    // Create the main product
    const product = await stripe.products.create({
      name: 'Shahada Metal Car Decal - Islamic Car Emblem',
      description: 'Premium Shahada Metal Car Decal - High-quality metal material, 16*3.5CM size, Trunk Sticker style. Perfect for Body and Rear installation. Single Pack with detailed installation instructions. Durable Islamic car emblem for Muslim car accessories.',
      url: 'https://deendecal.com',
      images: [
        'https://deendecal.com/images/goldIndy.jpg',
        'https://deendecal.com/images/blackIndy.jpg',
        'https://deendecal.com/images/redIndy.jpg',
        'https://deendecal.com/images/silverIndy.jpg'
      ],
      metadata: {
        category: 'Islamic Car Accessories',
        material: 'Metal',
        size: '16*3.5CM',
        style: 'Trunk Sticker'
      }
    });

    console.log('✅ Product created:', product.id);

    // Create prices for each color variant
    const colors = ['Gold', 'Black', 'Red', 'Silver'];
    const priceIds = {};

    for (const color of colors) {
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: 2499, // $24.99 in cents
        currency: 'usd',
        nickname: `${color} Shahada Decal`,
        metadata: {
          color: color,
          variant: color.toLowerCase()
        }
      });

      priceIds[color] = price.id;
      console.log(`✅ ${color} price created:`, price.id);
    }

    // Create a webhook endpoint for testing
    try {
      const webhook = await stripe.webhooks.create({
        url: 'https://deendecal.com/api/webhooks/stripe',
        enabled_events: [
          'checkout.session.completed',
          'payment_intent.succeeded',
          'payment_intent.payment_failed'
        ]
      });
      console.log('✅ Webhook created:', webhook.id);
    } catch (webhookError) {
      console.log('⚠️  Webhook creation failed (may already exist):', webhookError.message);
    }

    // Output the configuration
    console.log('\n🎉 Stripe setup complete!');
    console.log('\n📋 Configuration for your code:');
    console.log('Product ID:', product.id);
    console.log('\nPrice IDs:');
    Object.entries(priceIds).forEach(([color, priceId]) => {
      console.log(`  ${color}: ${priceId}`);
    });

    // Create a config file
    const config = {
      productId: product.id,
      priceIds: priceIds,
      webhookUrl: 'https://deendecal.com/api/webhooks/stripe'
    };

    const fs = require('fs');
    fs.writeFileSync('stripe-config.json', JSON.stringify(config, null, 2));
    console.log('\n💾 Configuration saved to stripe-config.json');

  } catch (error) {
    console.error('❌ Error setting up Stripe products:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('🔑 Check your Stripe secret key in .env.local');
    }
    process.exit(1);
  }
}

setupStripeProducts();
