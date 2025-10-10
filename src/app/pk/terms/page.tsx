'use client';

import React from 'react';
import Navigation from '@/components/Navigation';

export default function PakistaniTermsPage() {

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
            
            <div className="space-y-6">
              <div className="terms-section">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h3>
                <p className="text-gray-700">
                  By accessing and using this website, you accept and agree to be bound by the terms and 
                  provision of this agreement.
                </p>
              </div>

              <div className="terms-section">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Product Information</h3>
                <p className="text-gray-700">
                  We strive to provide accurate product descriptions and images. However, we do not warrant 
                  that product descriptions or other content is accurate, complete, reliable, or error-free.
                </p>
              </div>

              <div className="terms-section">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Pricing and Payment</h3>
                <p className="text-gray-700">
                  All prices are in Pakistani Rupees (PKR) and are subject to change without notice. 
                  Payment is processed securely through Stripe.
                </p>
              </div>

              <div className="terms-section">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Shipping and Delivery</h3>
                <p className="text-gray-700">
                  We offer free shipping across Pakistan. Delivery times are estimates and may vary. 
                  We are not responsible for delays caused by shipping carriers.
                </p>
              </div>

              <div className="terms-section">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">5. Returns and Refunds</h3>
                <p className="text-gray-700">
                  We offer a 30-day money-back guarantee. Returns must be in original condition. 
                  Contact us at deendecal@gmail.com to initiate a return.
                </p>
              </div>

              <div className="terms-section">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">6. Limitation of Liability</h3>
                <p className="text-gray-700">
                  In no event shall DeenDecal be liable for any indirect, incidental, special, consequential, 
                  or punitive damages arising out of your use of the website or products.
                </p>
              </div>

              <div className="terms-section">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">7. Contact Information</h3>
                <p className="text-gray-700">
                  If you have any questions about these Terms of Service, please contact us at deendecal@gmail.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
