'use client';

import React from 'react';
import Navigation from '@/components/Navigation';

export default function PakistaniPrivacyPage() {

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
            
            <div className="space-y-6">
              <div className="privacy-section">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Information We Collect</h3>
                <p className="text-gray-700">
                  We collect information you provide directly to us, such as when you create an account, 
                  make a purchase, or contact us for support.
                </p>
              </div>

              <div className="privacy-section">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">2. How We Use Your Information</h3>
                <p className="text-gray-700">
                  We use the information we collect to process transactions, send you technical notices, 
                  updates, security alerts, and support messages.
                </p>
              </div>

              <div className="privacy-section">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Information Sharing</h3>
                <p className="text-gray-700">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except as described in this policy.
                </p>
              </div>

              <div className="privacy-section">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Data Security</h3>
                <p className="text-gray-700">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>

              <div className="privacy-section">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">5. Cookies</h3>
                <p className="text-gray-700">
                  We use cookies to enhance your experience on our website. You can choose to disable 
                  cookies through your browser settings.
                </p>
              </div>

              <div className="privacy-section">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">6. Third-Party Services</h3>
                <p className="text-gray-700">
                  We use third-party services like Stripe for payment processing. These services have 
                  their own privacy policies.
                </p>
              </div>

              <div className="privacy-section">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">7. Contact Us</h3>
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy, please contact us at deendecal@gmail.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
