const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function setupWebhook() {
  try {
    console.log('🔗 Setting up Stripe webhook...');

    // Check if webhook already exists
    const existingWebhooks = await stripe.webhookEndpoints.list();
    const existingWebhook = existingWebhooks.data.find(
      webhook => webhook.url === 'https://deendecal.com/api/webhooks/stripe'
    );

    if (existingWebhook) {
      console.log('✅ Webhook already exists:', existingWebhook.id);
      console.log('Webhook URL:', existingWebhook.url);
      console.log('Status:', existingWebhook.status);
      return;
    }

    // Create new webhook endpoint
    const webhook = await stripe.webhookEndpoints.create({
      url: 'https://deendecal.com/api/webhooks/stripe',
      enabled_events: [
        'checkout.session.completed',
        'payment_intent.succeeded',
        'payment_intent.payment_failed',
        'invoice.payment_succeeded',
        'invoice.payment_failed'
      ],
      metadata: {
        description: 'DeenDecal Production Webhook'
      }
    });

    console.log('✅ Webhook created successfully!');
    console.log('Webhook ID:', webhook.id);
    console.log('Webhook URL:', webhook.url);
    console.log('Webhook Secret:', webhook.secret);
    console.log('Status:', webhook.status);
    console.log('Events:', webhook.enabled_events.join(', '));

    console.log('\n🔑 IMPORTANT: Update your .env.local with the webhook secret:');
    console.log(`STRIPE_WEBHOOK_SECRET=${webhook.secret}`);

  } catch (error) {
    console.error('❌ Error setting up webhook:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('🔑 Check your Stripe secret key in .env.local');
    }
  }
}

setupWebhook();
