// TikTok Events API integration
// This file provides functions to track TikTok conversion events

interface TikTokEvent {
  event: string;
  event_id: string;
  timestamp: string;
  properties: {
    content_type?: string;
    content_name?: string;
    content_category?: string;
    value?: number;
    currency?: string;
    [key: string]: string | number | boolean | undefined;
  };
}

interface TikTokConfig {
  pixelId: string;
  testEventCode?: string;
}

class TikTokEvents {
  private config: TikTokConfig;
  private isInitialized: boolean = false;

  constructor() {
    this.config = {
      pixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || '',
      testEventCode: process.env.NEXT_PUBLIC_TIKTOK_TEST_EVENT_CODE
    };
  }

  private initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    // Initialize TikTok Pixel
    if (this.config.pixelId) {
      (window as unknown as Record<string, unknown>).ttq = (window as unknown as Record<string, unknown>).ttq || [];
      (((window as unknown as Record<string, unknown>).ttq) as { load: (pixelId: string) => void }).load(this.config.pixelId);
      this.isInitialized = true;
    }
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private trackEvent(eventName: string, properties: Record<string, string | number | boolean | undefined> = {}) {
    if (typeof window === 'undefined') return;
    
    this.initialize();
    
    if (!this.isInitialized) {
      console.warn('TikTok Pixel not initialized');
      return;
    }

    const event: TikTokEvent = {
      event: eventName,
      event_id: this.generateEventId(),
      timestamp: new Date().toISOString(),
      properties: {
        ...properties,
        currency: 'USD'
      }
    };

    // Send to TikTok
    if ((window as unknown as Record<string, unknown>).ttq) {
      (((window as unknown as Record<string, unknown>).ttq) as { track: (eventName: string, properties: Record<string, unknown>) => void }).track(eventName, properties);
    }

    // Also send to our API for server-side tracking
    this.sendToAPI(event);
  }

  private async sendToAPI(event: TikTokEvent) {
    try {
      await fetch('/api/tiktok-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to send TikTok event to API:', error);
    }
  }

  // Track page view
  trackPageView() {
    this.trackEvent('PageView');
  }

  // Track when user views a product
  trackViewContent(product: Record<string, string | number | boolean | undefined>) {
    this.trackEvent('ViewContent', {
      content_type: 'product',
      content_name: product.name,
      content_category: 'Islamic Car Emblems',
      value: Number(product.price),
      currency: 'USD'
    });
  }

  // Track when user adds item to cart
  trackAddToCart(product: Record<string, string | number | boolean | undefined>, quantity: number = 1) {
    this.trackEvent('AddToCart', {
      content_type: 'product',
      content_name: product.name,
      content_category: 'Islamic Car Emblems',
      value: Number(product.price) * quantity,
      currency: 'USD',
      quantity: quantity
    });
  }

  // Track when user initiates checkout
  trackInitiateCheckout(items: Record<string, string | number | boolean | undefined>[], value: number) {
    this.trackEvent('InitiateCheckout', {
      content_type: 'product',
      content_name: 'Shopping Cart',
      content_category: 'Islamic Car Emblems',
      value: value,
      currency: 'USD',
      num_items: items.length
    });
  }

  // Track when user completes purchase
  trackPurchase(orderId: string, items: Record<string, string | number | boolean | undefined>[], value: number) {
    this.trackEvent('CompletePayment', {
      content_type: 'product',
      content_name: 'Order',
      content_category: 'Islamic Car Emblems',
      value: value,
      currency: 'USD',
      order_id: orderId,
      num_items: items.length
    });
  }

  // Track when user searches
  trackSearch(searchTerm: string) {
    this.trackEvent('Search', {
      search_string: searchTerm
    });
  }

  // Track when user contacts us
  trackContact() {
    this.trackEvent('Contact');
  }

  // Track custom events
  trackCustomEvent(eventName: string, properties: Record<string, string | number | boolean | undefined> = {}) {
    this.trackEvent(eventName, properties);
  }
}

// Export singleton instance
export const tiktokEvents = new TikTokEvents();