#!/usr/bin/env node

/**
 * Test Custom Domain Setup
 * 
 * This script tests if the custom domain is properly configured.
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testCustomDomain() {
  try {
    console.log('🧪 Testing Custom Domain Setup...\n');
    
    // Check environment variables
    console.log('📋 Environment Variables:');
    console.log(`   NEXT_PUBLIC_STRIPE_DOMAIN: ${process.env.NEXT_PUBLIC_STRIPE_DOMAIN || 'Not set'}`);
    console.log(`   NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL || 'Not set'}\n`);
    
    // Test DNS resolution
    const dns = require('dns');
    const { promisify } = require('util');
    const resolveCname = promisify(dns.resolveCname);
    
    try {
      const cnameRecords = await resolveCname('pay.deendecal.com');
      console.log('✅ DNS Resolution:');
      console.log(`   pay.deendecal.com → ${cnameRecords.join(', ')}`);
      
      if (cnameRecords.includes('checkout.stripe.com')) {
        console.log('   ✅ Correctly points to Stripe\n');
      } else {
        console.log('   ❌ Does not point to checkout.stripe.com\n');
      }
    } catch (error) {
      console.log('❌ DNS Resolution Failed:');
      console.log(`   ${error.message}\n`);
    }
    
    // Test Stripe account domain configuration
    try {
      const account = await stripe.accounts.retrieve();
      console.log('🏢 Stripe Account:');
      console.log(`   Account ID: ${account.id}`);
      console.log(`   Country: ${account.country}\n`);
      
      // Check if custom domain is configured
      try {
        const domain = await stripe.accounts.retrieveDomain();
        console.log('🌐 Custom Domain Status:');
        console.log(`   Domain: ${domain.domain}`);
        console.log(`   Status: ${domain.status}`);
        
        if (domain.status === 'verified') {
          console.log('   ✅ Domain is verified and ready to use\n');
        } else {
          console.log('   ⏳ Domain is not yet verified\n');
        }
      } catch (error) {
        console.log('ℹ️  No custom domain configured in Stripe yet\n');
      }
      
    } catch (error) {
      console.error('❌ Error checking Stripe account:', error.message);
    }
    
    // Test checkout session creation
    console.log('🛒 Testing Checkout Session Creation...');
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [{
          price: 'price_1SCDmMBJjaZO6BBglBDEdWpB', // Gold variant
          quantity: 1,
        }],
        mode: 'payment',
        success_url: 'https://deendecal.com/success',
        cancel_url: 'https://deendecal.com/cart',
        // Include custom domain if set
        ...(process.env.NEXT_PUBLIC_STRIPE_DOMAIN && {
          domain: process.env.NEXT_PUBLIC_STRIPE_DOMAIN
        }),
      });
      
      console.log('✅ Checkout session created successfully!');
      console.log(`   Session ID: ${session.id}`);
      console.log(`   URL: ${session.url}`);
      
      if (session.url.includes('pay.deendecal.com')) {
        console.log('   ✅ Using custom domain!\n');
      } else {
        console.log('   ⚠️  Using default Stripe domain\n');
      }
      
    } catch (error) {
      console.error('❌ Checkout session creation failed:', error.message);
    }
    
    console.log('📋 Next Steps:');
    console.log('1. If DNS is not configured, add CNAME record: pay → checkout.stripe.com');
    console.log('2. If domain is not verified, complete setup in Stripe Dashboard');
    console.log('3. Set environment variable: NEXT_PUBLIC_STRIPE_DOMAIN=pay.deendecal.com');
    console.log('4. Deploy your changes to production\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testCustomDomain();
