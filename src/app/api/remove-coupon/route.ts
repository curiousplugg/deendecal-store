import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { couponCode } = await request.json();

    if (!couponCode) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    // For now, we just return success since we're not actually removing the coupon from Stripe
    // In a real implementation, you might want to track applied coupons in your database
    // and remove them when the user removes the coupon from their cart
    
    return NextResponse.json({
      success: true,
      message: 'Coupon removed successfully'
    });

  } catch (error) {
    console.error('Remove coupon error:', error);
    
    return NextResponse.json(
      { error: 'Failed to remove coupon' },
      { status: 500 }
    );
  }
}
