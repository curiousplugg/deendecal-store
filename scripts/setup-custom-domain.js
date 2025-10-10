#!/usr/bin/env node

/**
 * Stripe Custom Domain Setup Helper
 * 
 * This script helps you set up the custom domain for Stripe checkout.
 * You'll need to complete the DNS configuration manually.
 */

async function setupCustomDomain() {
  try {
    console.log('🔧 Setting up Stripe Custom Domain...\n');
    
    console.log('📋 Next Steps:');
    console.log('1. Go to your Stripe Dashboard: https://dashboard.stripe.com/settings/domains');
    console.log('2. Click "Add domain" and enter: pay.deendecal.com');
    console.log('3. Add the following DNS records to your domain:');
    console.log('   Type: CNAME');
    console.log('   Name: pay');
    console.log('   Value: checkout.stripe.com');
    console.log('4. Wait for DNS propagation (usually 5-15 minutes)');
    console.log('5. Verify the domain in Stripe Dashboard');
    console.log('6. Test your checkout flow\n');
    
    console.log('🔍 DNS Configuration Details:');
    console.log('   Domain: pay.deendecal.com');
    console.log('   CNAME Record: checkout.stripe.com');
    console.log('   TTL: 300 (5 minutes) or default\n');
    
    console.log('✅ After DNS setup, your checkout URLs will be:');
    console.log('   Checkout: pay.deendecal.com/c/...');
    console.log('   Payment Links: pay.deendecal.com/b/...');
    console.log('   Customer Portal: pay.deendecal.com/p/...\n');
    
    console.log('🧪 Test Commands:');
    console.log('   npx vercel env add NEXT_PUBLIC_STRIPE_DOMAIN');
    console.log('   # Enter: pay.deendecal.com');
    console.log('   npm run test:stripe\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupCustomDomain();
