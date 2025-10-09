// TikTok Events API - Server-side tracking
import crypto from 'crypto';

// TikTok Events API configuration
const TIKTOK_API_BASE_URL = 'https://business-api.tiktok.com/open_api/v1.3/event/track/';
const PIXEL_ID = 'D3JTBE3C77UCFFQTL14G';

// You'll need to generate an access token from TikTok Ads Manager
// Add it to your environment variables as TIKTOK_ACCESS_TOKEN
const ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN;

// Hash function for PII data (SHA-256)
const hashData = (data: string): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Generate unique event ID
const generateEventId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get current timestamp in seconds
const getCurrentTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

// TikTok Events API payload structure
interface TikTokEventPayload {
  pixel_code: string;
  data: Array<{
    event: string;
    event_id: string;
    timestamp: string;
    properties: {
      contents?: Array<{
        content_id: string;
        content_type: string;
        content_name: string;
        num_items?: number;
      }>;
      value?: number;
      currency?: string;
      search_string?: string;
    };
    user: {
      email?: string;
      phone?: string;
      external_id?: string;
      ip?: string;
      user_agent?: string;
      ttclid?: string;
      ttp?: string;
    };
    page: {
      url: string;
    };
  }>;
}

// Send event to TikTok Events API
export const sendTikTokEvent = async (
  event: string,
  properties: Record<string, unknown>,
  userInfo?: {
    email?: string;
    phone?: string;
    externalId?: string;
    ip?: string;
    userAgent?: string;
    ttclid?: string;
    ttp?: string;
  },
  url?: string
): Promise<boolean> => {
  if (!ACCESS_TOKEN) {
    console.warn('TikTok Events API: No access token provided');
    return false;
  }

  try {
    const payload: TikTokEventPayload = {
      pixel_code: PIXEL_ID,
      data: [
        {
          event,
          event_id: generateEventId(),
          timestamp: getCurrentTimestamp().toString(),
          properties: {
            ...properties,
          },
          user: {
            ...(userInfo?.email && { email: hashData(userInfo.email) }),
            ...(userInfo?.phone && { phone: hashData(userInfo.phone) }),
            ...(userInfo?.externalId && { external_id: hashData(userInfo.externalId) }),
            ...(userInfo?.ip && { ip: userInfo.ip }),
            ...(userInfo?.userAgent && { user_agent: userInfo.userAgent }),
            ...(userInfo?.ttclid && { ttclid: userInfo.ttclid }),
            ...(userInfo?.ttp && { ttp: userInfo.ttp }),
          },
          page: {
            url: url || 'https://deendecal.com',
          },
        },
      ],
    };

    const response = await fetch(TIKTOK_API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': ACCESS_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('TikTok Events API error:', response.status, await response.text());
      return false;
    }

    console.log('TikTok Events API: Event sent successfully');
    return true;
  } catch (error) {
    console.error('TikTok Events API error:', error);
    return false;
  }
};

// Specific event tracking functions
export const tiktokEventsAPI = {
  // Track ViewContent event
  trackViewContent: async (
    product: { id: string; name: string; price: number },
    userInfo?: { email?: string; phone?: string; externalId?: string; ip?: string; userAgent?: string },
    url?: string
  ) => {
    return sendTikTokEvent(
      'ViewContent',
      {
        contents: [
          {
            content_id: product.id,
            content_type: 'product',
            content_name: product.name,
            num_items: 1,
          },
        ],
        value: product.price,
        currency: 'USD',
      },
      userInfo,
      url
    );
  },

  // Track AddToCart event
  trackAddToCart: async (
    product: { id: string; name: string; price: number },
    quantity: number = 1,
    userInfo?: { email?: string; phone?: string; externalId?: string; ip?: string; userAgent?: string },
    url?: string
  ) => {
    return sendTikTokEvent(
      'AddToCart',
      {
        contents: [
          {
            content_id: product.id,
            content_type: 'product',
            content_name: product.name,
          },
        ],
        value: product.price * quantity,
        currency: 'USD',
      },
      userInfo,
      url
    );
  },

  // Track InitiateCheckout event
  trackInitiateCheckout: async (
    items: { id: string; name: string; price: number; quantity: number }[],
    userInfo?: { email?: string; phone?: string; externalId?: string; ip?: string; userAgent?: string },
    url?: string
  ) => {
    const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    return sendTikTokEvent(
      'InitiateCheckout',
      {
        contents: items.map(item => ({
          content_id: item.id,
          content_type: 'product',
          content_name: item.name,
        })),
        value: totalValue,
        currency: 'USD',
      },
      userInfo,
      url
    );
  },

  // Track Purchase event
  trackPurchase: async (
    items: { id: string; name: string; price: number; quantity: number }[],
    userInfo?: { email?: string; phone?: string; externalId?: string; ip?: string; userAgent?: string },
    url?: string
  ) => {
    const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    return sendTikTokEvent(
      'Purchase',
      {
        contents: items.map(item => ({
          content_id: item.id,
          content_type: 'product',
          content_name: item.name,
        })),
        value: totalValue,
        currency: 'USD',
      },
      userInfo,
      url
    );
  },

  // Track AddPaymentInfo event
  trackAddPaymentInfo: async (
    items: { id: string; name: string; price: number; quantity: number }[],
    userInfo?: { email?: string; phone?: string; externalId?: string; ip?: string; userAgent?: string },
    url?: string
  ) => {
    const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    return sendTikTokEvent(
      'AddPaymentInfo',
      {
        contents: items.map(item => ({
          content_id: item.id,
          content_type: 'product',
          content_name: item.name,
        })),
        value: totalValue,
        currency: 'USD',
      },
      userInfo,
      url
    );
  },

  // Track AddToWishlist event
  trackAddToWishlist: async (
    product: { id: string; name: string; price: number },
    userInfo?: { email?: string; phone?: string; externalId?: string; ip?: string; userAgent?: string },
    url?: string
  ) => {
    return sendTikTokEvent(
      'AddToWishlist',
      {
        contents: [
          {
            content_id: product.id,
            content_type: 'product',
            content_name: product.name,
          },
        ],
        value: product.price,
        currency: 'USD',
      },
      userInfo,
      url
    );
  },

  // Track Search event
  trackSearch: async (
    searchString: string,
    product?: { id: string; name: string; price: number },
    userInfo?: { email?: string; phone?: string; externalId?: string; ip?: string; userAgent?: string },
    url?: string
  ) => {
    const searchData: Record<string, unknown> = {
      search_string: searchString,
      value: product?.price || 0,
      currency: 'USD',
    };

    if (product) {
      searchData.contents = [
        {
          content_id: product.id,
          content_type: 'product',
          content_name: product.name,
        },
      ];
    }

    return sendTikTokEvent('Search', searchData, userInfo, url);
  },

  // Track PlaceAnOrder event
  trackPlaceAnOrder: async (
    items: { id: string; name: string; price: number; quantity: number }[],
    userInfo?: { email?: string; phone?: string; externalId?: string; ip?: string; userAgent?: string },
    url?: string
  ) => {
    const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    return sendTikTokEvent(
      'PlaceAnOrder',
      {
        contents: items.map(item => ({
          content_id: item.id,
          content_type: 'product',
          content_name: item.name,
        })),
        value: totalValue,
        currency: 'USD',
      },
      userInfo,
      url
    );
  },

  // Track CompleteRegistration event
  trackCompleteRegistration: async (
    product?: { id: string; name: string; price: number },
    userInfo?: { email?: string; phone?: string; externalId?: string; ip?: string; userAgent?: string },
    url?: string
  ) => {
    const registrationData: Record<string, unknown> = {
      value: product?.price || 0,
      currency: 'USD',
    };

    if (product) {
      registrationData.contents = [
        {
          content_id: product.id,
          content_type: 'product',
          content_name: product.name,
        },
      ];
    }

    return sendTikTokEvent('CompleteRegistration', registrationData, userInfo, url);
  },
};
