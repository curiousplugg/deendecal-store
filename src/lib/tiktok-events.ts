// TikTok Event Tracking Utilities
declare global {
  interface Window {
    ttq: {
      track: (event: string, data: Record<string, unknown>, options?: Record<string, unknown>) => void;
      identify: (data: Record<string, unknown>) => void;
    };
  }
}

// Generate unique event ID
const generateEventId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Hash function for PII data (SHA-256)
const hashData = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// TikTok Event Tracking Functions
export const tiktokEvents = {
  // Track page view with product content
  trackViewContent: (product: { id: string; name: string; price: number }) => {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track('ViewContent', {
        contents: [
          {
            content_id: product.id,
            content_type: 'product',
            content_name: product.name,
            num_items: 1
          }
        ],
        value: product.price,
        currency: 'USD'
      }, {
        event_id: generateEventId()
      });
    }
  },

  // Track add to cart
  trackAddToCart: (product: { id: string; name: string; price: number }, quantity: number = 1) => {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track('AddToCart', {
        contents: [
          {
            content_id: product.id,
            content_type: 'product',
            content_name: product.name
          }
        ],
        value: product.price * quantity,
        currency: 'USD'
      }, {
        event_id: generateEventId()
      });
    }
  },

  // Track checkout initiation
  trackInitiateCheckout: (items: { id: string; name: string }[], totalValue: number) => {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track('InitiateCheckout', {
        contents: items.map(item => ({
          content_id: item.id,
          content_type: 'product',
          content_name: item.name
        })),
        value: totalValue,
        currency: 'USD'
      }, {
        event_id: generateEventId()
      });
    }
  },

  // Track purchase completion
  trackPurchase: (items: { id: string; name: string }[], totalValue: number) => {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track('Purchase', {
        contents: items.map(item => ({
          content_id: item.id,
          content_type: 'product',
          content_name: item.name
        })),
        value: totalValue,
        currency: 'USD'
      }, {
        event_id: generateEventId()
      });
    }
  },

  // Track payment info addition
  trackAddPaymentInfo: (items: { id: string; name: string }[], totalValue: number) => {
    if (typeof window !== 'undefined' && window.ttq) {
      window.ttq.track('AddPaymentInfo', {
        contents: items.map(item => ({
          content_id: item.id,
          content_type: 'product',
          content_name: item.name
        })),
        value: totalValue,
        currency: 'USD'
      }, {
        event_id: generateEventId()
      });
    }
  },

  // Identify user with hashed PII data
  identifyUser: async (email?: string, phone?: string, externalId?: string) => {
    if (typeof window !== 'undefined' && window.ttq) {
      const identifyData: Record<string, string> = {};
      
      if (email) {
        identifyData.email = await hashData(email);
      }
      if (phone) {
        identifyData.phone_number = await hashData(phone);
      }
      if (externalId) {
        identifyData.external_id = await hashData(externalId);
      }

      if (Object.keys(identifyData).length > 0) {
        window.ttq.identify(identifyData);
      }
    }
  }
};
