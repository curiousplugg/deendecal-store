const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Current price IDs (to be archived)
const OLD_PRICE_IDS = {
  'Gold': 'price_1SCDmMBJjaZO6BBglBDEdWpB',
  'Black': 'price_1SCDmNBJjaZO6BBgwmbOsk9g',
  'Red': 'price_1SCDmNBJjaZO6BBgwejHag8d',
  'Silver': 'price_1SCDmOBJjaZO6BBgFh2xylqB'
};

// New price: $17.99 = 1799 cents
const NEW_PRICE_AMOUNT = 1799; // $17.99 in cents

async function updateStripePrices() {
  try {
    console.log('🚀 Updating Stripe prices from $24.99 to $17.99...\n');

    // First, get the product ID from one of the existing prices
    const samplePrice = await stripe.prices.retrieve(OLD_PRICE_IDS['Gold']);
    const productId = samplePrice.product;
    
    console.log('📦 Product ID:', productId);
    console.log('💰 Creating new prices at $17.99...\n');

    // Create new prices for each color variant
    const colors = ['Gold', 'Black', 'Red', 'Silver'];
    const newPriceIds = {};

    for (const color of colors) {
      // Create new price
      const newPrice = await stripe.prices.create({
        product: productId,
        unit_amount: NEW_PRICE_AMOUNT,
        currency: 'usd',
        nickname: `${color} Shahada Decal - $17.99`,
        metadata: {
          color: color,
          variant: color.toLowerCase(),
          updated_at: new Date().toISOString()
        }
      });

      newPriceIds[color] = newPrice.id;
      console.log(`✅ ${color} - New price created: ${newPrice.id} ($17.99)`);

      // Archive the old price (optional, but recommended)
      try {
        await stripe.prices.update(OLD_PRICE_IDS[color], {
          active: false
        });
        console.log(`   📌 Old price archived: ${OLD_PRICE_IDS[color]}`);
      } catch (archiveError) {
        console.log(`   ⚠️  Could not archive old price: ${archiveError.message}`);
      }
    }

    // Output the new configuration
    console.log('\n🎉 Price update complete!');
    console.log('\n📋 NEW Price IDs for your code:');
    console.log('const PRICE_IDS = {');
    Object.entries(newPriceIds).forEach(([color, priceId]) => {
      console.log(`  '${color}': '${priceId}',`);
    });
    console.log('};');

    // Update the config file if it exists
    const fs = require('fs');
    if (fs.existsSync('stripe-config.json')) {
      const config = JSON.parse(fs.readFileSync('stripe-config.json', 'utf8'));
      config.priceIds = newPriceIds;
      config.updatedAt = new Date().toISOString();
      fs.writeFileSync('stripe-config.json', JSON.stringify(config, null, 2));
      console.log('\n💾 Configuration updated in stripe-config.json');
    }

    console.log('\n⚠️  IMPORTANT: Update these price IDs in your code:');
    console.log('   - src/app/api/checkout/route.ts');
    console.log('   - src/app/actions/stripe.ts');
    console.log('\n📝 Old prices have been archived (set to inactive).');

  } catch (error) {
    console.error('❌ Error updating Stripe prices:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('🔑 Check your Stripe secret key in .env.local');
    }
    if (error.type === 'StripeInvalidRequestError') {
      console.error('📝 Error details:', error.message);
    }
    process.exit(1);
  }
}

updateStripePrices();

