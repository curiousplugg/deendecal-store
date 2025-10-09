import { NextRequest, NextResponse } from 'next/server';
import { tiktokEventsAPI } from '@/lib/tiktok-events-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, product, items, quantity, userInfo, url } = body;

    // Get user info from request headers
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || '';

    const enhancedUserInfo = {
      ...userInfo,
      ip,
      userAgent,
    };

    let success = false;

    switch (event) {
      case 'ViewContent':
        if (product) {
          success = await tiktokEventsAPI.trackViewContent(product, enhancedUserInfo, url);
        }
        break;

      case 'AddToCart':
        if (product) {
          success = await tiktokEventsAPI.trackAddToCart(product, quantity || 1, enhancedUserInfo, url);
        }
        break;

      case 'InitiateCheckout':
        if (items && Array.isArray(items)) {
          success = await tiktokEventsAPI.trackInitiateCheckout(items, enhancedUserInfo, url);
        }
        break;

      case 'Purchase':
        if (items && Array.isArray(items)) {
          success = await tiktokEventsAPI.trackPurchase(items, enhancedUserInfo, url);
        }
        break;

      case 'AddPaymentInfo':
        if (items && Array.isArray(items)) {
          success = await tiktokEventsAPI.trackAddPaymentInfo(items, enhancedUserInfo, url);
        }
        break;

      default:
        return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
    }

    if (success) {
      return NextResponse.json({ success: true, message: 'Event tracked successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
    }
  } catch (error) {
    console.error('TikTok Events API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
