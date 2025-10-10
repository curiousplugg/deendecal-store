import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { couponCode } = await request.json();

    if (!couponCode) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    // Retrieve the coupon from Stripe (case sensitive)
    const coupon = await stripe.coupons.retrieve(couponCode);

    if (!coupon || !coupon.valid) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid or expired coupon code. Please check the spelling and case.'
      });
    }

    // Format discount text
    let discountText = '';
    if (coupon.percent_off) {
      discountText = `${coupon.percent_off}% off`;
    } else if (coupon.amount_off) {
      const currency = coupon.currency?.toUpperCase() || 'USD';
      const amount = (coupon.amount_off / 100).toFixed(2);
      discountText = `$${amount} ${currency} off`;
    }

    return NextResponse.json({
      valid: true,
      discountText,
      coupon: {
        id: coupon.id,
        percent_off: coupon.percent_off,
        amount_off: coupon.amount_off,
        currency: coupon.currency,
        duration: coupon.duration,
        duration_in_months: coupon.duration_in_months,
        max_redemptions: coupon.max_redemptions,
        times_redeemed: coupon.times_redeemed
      }
    });

  } catch (error) {
    console.error('Coupon validation error:', error);
    
    // Handle specific Stripe errors
    if (error instanceof Error && error.message.includes('No such coupon')) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid coupon code. Please check the spelling and case.'
      });
    }

    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
