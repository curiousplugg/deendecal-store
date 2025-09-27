# DeenDecal Store Deployment Guide

## Environment Variables Setup

### For Production (deendecal.com)

Set these environment variables in your deployment platform (Vercel, Netlify, etc.):

```bash
# Stripe Configuration (LIVE MODE)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# App Configuration
NEXT_PUBLIC_APP_URL=https://deendecal.com
NEXT_PUBLIC_DOMAIN=deendecal.com
```

### For Development (localhost)

```bash
# Stripe Configuration (LIVE MODE - same as production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=deendecal.com
```

## Stripe Webhook Configuration

### Webhook Endpoint URL
```
https://deendecal.com/api/webhooks/stripe
```

### Events to Listen For
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

## Stripe Price IDs (LIVE MODE)

Your current price IDs for each color variant:
- **Gold**: `price_1SBkbeBJjaZO6BBgJD1bAJvt`
- **Black**: `price_1SBkbeBJjaZO6BBgkuwcTysc`
- **Red**: `price_1SBkbeBJjaZO6BBgUjC7X59s`
- **Silver**: `price_1SBkbeBJjaZO6BBgbNls06pg`

## Deployment Checklist

### Before Deployment
- [ ] Environment variables set correctly
- [ ] Stripe webhook endpoint configured
- [ ] Domain DNS pointing to deployment platform
- [ ] SSL certificate active

### After Deployment
- [ ] Test checkout flow end-to-end
- [ ] Verify webhook receives events
- [ ] Test success and cancel redirects
- [ ] Check console for any errors

## Testing the Checkout Flow

1. **Add items to cart** on your site
2. **Click "Proceed to Checkout"**
3. **Should redirect to Stripe checkout page**
4. **Complete test payment**
5. **Should redirect back to success page**
6. **Cart should be cleared**

## Troubleshooting

### Common Issues
1. **Checkout not redirecting**: Check `NEXT_PUBLIC_APP_URL` environment variable
2. **Webhook not receiving events**: Verify webhook URL and secret
3. **CORS errors**: Check domain configuration in Stripe dashboard
4. **Payment not processing**: Verify price IDs are correct

### Debug Commands
```bash
# Test API endpoint
curl -X POST https://deendecal.com/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"items":[{"id":"test","name":"Test","price":10,"quantity":1,"selectedColor":"Gold"}]}'

# Check environment variables
echo $NEXT_PUBLIC_APP_URL
echo $STRIPE_SECRET_KEY
```

## Security Notes

- Never commit `.env.local` or `.env.production` to version control
- Use environment variables in your deployment platform
- Keep Stripe keys secure and rotate them regularly
- Monitor webhook events for suspicious activity
