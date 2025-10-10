'use client';

import React from 'react';
import Navigation from '@/components/Navigation';

export default function PakistaniFAQPage() {

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
            
            <div className="space-y-6">
              <div className="faq-item">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">What is the Shahada Car Decal?</h3>
                <p className="text-gray-700">
                  The Shahada Car Decal is a premium Islamic car emblem featuring the Islamic declaration of faith. 
                  It&apos;s made from high-quality metal material and designed for easy installation on your vehicle.
                </p>
              </div>

              <div className="faq-item">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">What colors are available?</h3>
                <p className="text-gray-700">
                  We offer four beautiful colors: Gold, Black, Red, and Silver. Each color maintains the same 
                  premium quality and durability.
                </p>
              </div>

              <div className="faq-item">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">How do I install the decal?</h3>
                <p className="text-gray-700">
                  Installation is simple and straightforward. Clean the area, peel off the protective film, 
                  align the decal, and press firmly. Detailed instructions are included with each order.
                </p>
              </div>

              <div className="faq-item">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">What is the size of the decal?</h3>
                <p className="text-gray-700">
                  The decal measures 16cm x 3.5cm, making it the perfect size for car installation while 
                  being clearly visible and readable.
                </p>
              </div>

              <div className="faq-item">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Is shipping free in Pakistan?</h3>
                <p className="text-gray-700">
                  Yes! We offer free shipping across Pakistan. Delivery typically takes 1-2 weeks.
                </p>
              </div>

              <div className="faq-item">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">What if I&apos;m not satisfied?</h3>
                <p className="text-gray-700">
                  We offer a 30-day money-back guarantee. If you&apos;re not completely satisfied with your purchase, 
                  contact us for a full refund.
                </p>
              </div>

              <div className="faq-item">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">How do I contact support?</h3>
                <p className="text-gray-700">
                  You can reach us at deendecal@gmail.com. We respond to all inquiries within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
