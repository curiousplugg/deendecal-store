#!/usr/bin/env node

/**
 * DNS Debug Script for pay.deendecal.com
 * 
 * This script helps debug the DNS configuration for the custom domain.
 */

const dns = require('dns');
const { promisify } = require('util');

async function debugDNS() {
  console.log('🔍 Debugging DNS Configuration for pay.deendecal.com\n');
  
  try {
    // Check CNAME record
    console.log('📋 Checking CNAME record for pay.deendecal.com...');
    const resolveCname = promisify(dns.resolveCname);
    const cnameRecords = await resolveCname('pay.deendecal.com');
    console.log('✅ CNAME Records:', cnameRecords);
    
    if (cnameRecords.includes('checkout.stripe.com')) {
      console.log('✅ DNS is correctly configured!\n');
    } else {
      console.log('❌ DNS is NOT correctly configured');
      console.log('   Expected: checkout.stripe.com');
      console.log('   Found:', cnameRecords.join(', '));
      console.log('');
    }
    
    // Check A record (should not exist for CNAME)
    console.log('📋 Checking A record for pay.deendecal.com...');
    try {
      const resolve4 = promisify(dns.resolve4);
      const aRecords = await resolve4('pay.deendecal.com');
      console.log('⚠️  A Records found:', aRecords);
      console.log('   This might conflict with CNAME record\n');
    } catch (error) {
      console.log('✅ No A records found (this is correct for CNAME)\n');
    }
    
    // Check if domain resolves to Stripe
    console.log('📋 Testing domain resolution...');
    const https = require('https');
    
    const testUrl = 'https://pay.deendecal.com';
    console.log(`   Testing: ${testUrl}`);
    
    const response = await new Promise((resolve, reject) => {
      const req = https.request(testUrl, { method: 'HEAD' }, (res) => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers
        });
      });
      
      req.on('error', reject);
      req.setTimeout(5000, () => reject(new Error('Timeout')));
      req.end();
    });
    
    console.log('✅ Domain is accessible!');
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Server: ${response.headers.server || 'Unknown'}`);
    
    if (response.headers.server && response.headers.server.includes('Stripe')) {
      console.log('✅ Domain is correctly pointing to Stripe!\n');
    } else {
      console.log('⚠️  Domain is accessible but may not be pointing to Stripe\n');
    }
    
  } catch (error) {
    console.log('❌ DNS Configuration Issues:');
    console.log(`   Error: ${error.message}\n`);
    
    if (error.code === 'ENOTFOUND') {
      console.log('🔧 DNS Not Found - Possible Issues:');
      console.log('   1. CNAME record not created yet');
      console.log('   2. DNS propagation still in progress (wait 5-15 minutes)');
      console.log('   3. Wrong DNS provider settings');
      console.log('');
    }
    
    if (error.code === 'ENODATA') {
      console.log('🔧 No DNS Data - Possible Issues:');
      console.log('   1. CNAME record not created');
      console.log('   2. DNS provider not configured correctly');
      console.log('');
    }
  }
  
  console.log('📋 Next Steps:');
  console.log('1. If DNS is not configured:');
  console.log('   - Add CNAME record: pay → checkout.stripe.com');
  console.log('   - Wait 5-15 minutes for propagation');
  console.log('');
  console.log('2. If DNS is configured but not working:');
  console.log('   - Check Stripe Dashboard: https://dashboard.stripe.com/settings/domains');
  console.log('   - Verify domain is added and verified');
  console.log('');
  console.log('3. Test again:');
  console.log('   node scripts/debug-dns.js');
  console.log('');
}

// Run the debug
debugDNS();
