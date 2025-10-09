#!/usr/bin/env node

/**
 * Setup script for TikTok Events API environment variables
 * 
 * This script helps you set up the TikTok access token in your Vercel deployment.
 * 
 * Steps to complete the setup:
 * 
 * 1. Go to your Vercel dashboard: https://vercel.com/dashboard
 * 2. Select your deendecal-store project
 * 3. Go to Settings > Environment Variables
 * 4. Add a new environment variable:
 *    - Name: TIKTOK_ACCESS_TOKEN
 *    - Value: 5eacbb7bc0cf5f5efe551b07612ef98dffc24954
 *    - Environment: Production, Preview, Development
 * 5. Save the environment variable
 * 6. Redeploy your project
 * 
 * Alternatively, you can use the Vercel CLI:
 * vercel env add TIKTOK_ACCESS_TOKEN
 * 
 * Then enter the token value when prompted.
 */

console.log('🎯 TikTok Events API Setup Instructions:');
console.log('');
console.log('1. Go to Vercel Dashboard: https://vercel.com/dashboard');
console.log('2. Select your deendecal-store project');
console.log('3. Go to Settings > Environment Variables');
console.log('4. Add environment variable:');
console.log('   - Name: TIKTOK_ACCESS_TOKEN');
console.log('   - Value: 5eacbb7bc0cf5f5efe551b07612ef98dffc24954');
console.log('   - Environment: Production, Preview, Development');
console.log('5. Save and redeploy your project');
console.log('');
console.log('✅ TikTok Events API will be ready after deployment!');
