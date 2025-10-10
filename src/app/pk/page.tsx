'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { products } from '@/data/products';
import { tiktokEvents } from '@/lib/tiktok-events';

export default function PakistaniHomePage() {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [selectedColor, setSelectedColor] = useState('Gold');
  const [quantity, setQuantity] = useState(1);
  const [showCartNotification, setShowCartNotification] = useState(false);

  const product = products[0]; // Single product

  // Track ViewContent on page load
  useEffect(() => {
    tiktokEvents.trackViewContent(product as unknown as Record<string, string | number | boolean | undefined>);
  }, [product]);

  const colorImages = {
    'Gold': '/images/goldIndy.jpg',
    'Black': '/images/blackIndy.jpg',
    'Red': '/images/redIndy.jpg',
    'Silver': '/images/silverIndy.jpg'
  };

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      selectedColor,
      price: 6950, // PKR price
      originalPrice: 6950
    };

    // Add multiple items if quantity > 1
    for (let i = 0; i < quantity; i++) {
      addItem(productToAdd);
    }
    
    // Track AddToCart event
    tiktokEvents.trackAddToCart(productToAdd as unknown as Record<string, string | number | boolean | undefined>, quantity);
    
    // Show notification
    setShowCartNotification(true);
    setTimeout(() => {
      setShowCartNotification(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {t('product.title')}
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                {t('product.description')}
              </p>
              
              {/* Price */}
              <div className="mb-8">
                <span className="text-4xl font-bold text-green-600">
                  {t('product.price')}
                </span>
                <p className="text-gray-600 mt-2">
                  {t('footer.shipping_info')}
                </p>
              </div>

              {/* Color Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('product.select_color')}
                </h3>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {['Gold', 'Black', 'Red', 'Silver'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                        selectedColor === color
                          ? 'bg-yellow-500 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
                <div className="flex items-center space-x-4">
                  <label className="text-lg font-medium text-gray-900">
                    {t('product.quantity')}:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-lg font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.5 5M7 13l2.5 5" />
                  </svg>
                  <span>{t('product.add_to_cart')}</span>
                </button>
              </div>

              {/* Cart Notification */}
              {showCartNotification && (
                <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Added to cart!</span>
                </div>
              )}
            </div>

            {/* Right Column - Product Image */}
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src={colorImages[selectedColor as keyof typeof colorImages]}
                  alt={`Islamic Car Emblem - ${selectedColor}`}
                  width={500}
                  height={500}
                  className="rounded-lg shadow-2xl"
                  priority
                />
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                  {t('product.price')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Features Section */}
      <section id="product" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('nav.products')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Premium quality Islamic car emblems designed for Pakistani customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">High-grade materials for durability</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Support</h3>
              <p className="text-gray-600">Customer service in Pakistan</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">Across Pakistan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {t('footer.contact')}
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-4">
              {t('footer.email')}
            </p>
            <p className="text-gray-600 mb-4">
              {t('footer.business_hours')}
            </p>
            <p className="text-gray-600">
              {t('footer.hours')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
