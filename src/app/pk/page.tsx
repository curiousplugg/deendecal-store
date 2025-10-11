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
  const [currentImage, setCurrentImage] = useState('/images/goldIndy.jpg');
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [showShippingPopup, setShowShippingPopup] = useState(false);
  const [showCartActionPopup, setShowCartActionPopup] = useState(false);
  const [isCartActionExiting, setIsCartActionExiting] = useState(false);

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

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCurrentImage(colorImages[color as keyof typeof colorImages]);
    setCurrentVideo(null);
  };

  const handleVideoSelect = (videoSrc: string) => {
    setCurrentVideo(videoSrc);
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
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Premium <span style={{color: '#c89d24'}}>Shahada</span> Metal Car Decal - Islamic Car Emblem</h1>
              <p>Premium Islamic car emblems and Shahada decals. Show your devotion with sophistication and grace.</p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Happy Customers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">4.9</span>
                  <span className="stat-label">Rating</span>
                </div>
                <div className="stat">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Support</span>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <Image
                src={currentImage}
                alt="Premium Islamic Car Emblem"
                width={500}
                height={500}
                className="hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="product" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Product Image */}
              <div className="order-2 lg:order-1">
                <div className="relative">
                  {currentVideo ? (
                    <video
                      src={currentVideo}
                      className="w-full h-96 object-cover rounded-lg shadow-lg"
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <Image
                      src={currentImage}
                      alt="Premium Islamic Car Emblem"
                      width={500}
                      height={500}
                      className="w-full h-96 object-cover rounded-lg shadow-lg"
                    />
                  )}
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {t('product.premium_badge')}
                  </div>
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="flex space-x-4 mt-6">
                  {Object.entries(colorImages).map(([color, image]) => (
                    <div
                      key={color}
                      className={`w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${
                        selectedColor === color ? 'border-yellow-500' : 'border-gray-300'
                      }`}
                      onClick={() => handleColorSelect(color)}
                    >
                      <Image
                        src={image}
                        alt={`${color} color`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 border-gray-300" onClick={() => handleVideoSelect('/videos/tiktok_20250926_115253.mp4')}>
                    <video
                      src="/videos/tiktok_20250926_115253.mp4"
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      poster="/images/video_installation_thumb.jpg"
                    />
                  </div>
                  <div className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 border-gray-300" onClick={() => handleVideoSelect('/videos/tiktok_20250926_120529.mp4')}>
                    <video
                      src="/videos/tiktok_20250926_120529.mp4"
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      poster="/images/video_application_thumb.jpg"
                    />
                  </div>
                  <div className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 border-gray-300" onClick={() => handleVideoSelect('/videos/tiktok_20250926_120542.mp4')}>
                    <video
                      src="/videos/tiktok_20250926_120542.mp4"
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      poster="/images/video_final_thumb.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {t('product.premium_title')}
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t('product.detailed_description')}
                </p>
                
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    PKR 6,950
                  </div>
                </div>

                {/* Color Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {t('product.select_color')}
                  </h3>
                  <div className="flex space-x-4">
                    {Object.entries(colorImages).map(([color, image]) => (
                      <button
                        key={color}
                        className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                          selectedColor === color 
                            ? 'border-yellow-500 bg-yellow-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => handleColorSelect(color)}
                      >
                        <Image
                          src={image}
                          alt={`${color} color`}
                          width={60}
                          height={60}
                          className="rounded-lg"
                        />
                        <span className="mt-2 text-sm font-medium text-gray-700">{color}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {t('product.quantity')}
                  </h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-semibold"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 mb-6"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.5 5M7 13l2.5 5" />
                  </svg>
                  <span>{t('product.add_to_cart')} - PKR 6,950</span>
                </button>

                {/* Product Features */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="text-gray-700">{t('product.free_shipping')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{t('product.money_back')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="text-gray-700">{t('product.premium_quality')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section id="installation" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('installation.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('installation.subtitle')}
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {t('installation.step1_title')}
                </h3>
                <p className="text-gray-600">
                  {t('installation.step1_desc')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {t('installation.step2_title')}
                </h3>
                <p className="text-gray-600">
                  {t('installation.step2_desc')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {t('installation.step3_title')}
                </h3>
                <p className="text-gray-600">
                  {t('installation.step3_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {t('about.title')}
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {t('about.p1')}
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {t('about.p2')}
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {t('about.feature1_title')}
                      </h4>
                      <p className="text-gray-600">
                        {t('about.feature1_desc')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {t('about.feature2_title')}
                      </h4>
                      <p className="text-gray-600">
                        {t('about.feature2_desc')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {t('about.feature3_title')}
                      </h4>
                      <p className="text-gray-600">
                        {t('about.feature3_desc')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-700 text-sm">
                    {t('about.transparency')}
                  </p>
                </div>
              </div>
              
              <div>
                <Image
                  src="/images/measurements.jpg"
                  alt={t('about.title')}
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('contact.title')}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t('contact.description')}
            </p>
            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a 
                  href={`mailto:${t('contact.email')}`}
                  className="text-2xl font-semibold text-gray-900 hover:text-yellow-600 transition-colors duration-200"
                >
                  {t('contact.email')}
                </a>
              </div>
              <p className="text-gray-600">
                {t('footer.hours')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Notification */}
      {showCartNotification && (
        <div className="cart-notification">
          <div className="notification-content">
            <i className="fas fa-check-circle"></i>
            <span>Added to cart!</span>
          </div>
        </div>
      )}

      {/* Shipping Popup */}
      {showShippingPopup && (
        <div className="popup-overlay" onClick={() => setShowShippingPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Shipping Information</h3>
              <button className="popup-close" onClick={() => setShowShippingPopup(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="popup-body">
              <div className="shipping-info">
                <div className="shipping-item">
                  <i className="fas fa-truck"></i>
                  <div>
                    <h4>Free Shipping</h4>
                    <p>Free shipping across Pakistan</p>
                  </div>
                </div>
                <div className="shipping-item">
                  <i className="fas fa-clock"></i>
                  <div>
                    <h4>Delivery Time</h4>
                    <p>1-2 weeks delivery time</p>
                  </div>
                </div>
                <div className="shipping-item">
                  <i className="fas fa-shield-alt"></i>
                  <div>
                    <h4>Secure Packaging</h4>
                    <p>Your emblem is carefully packaged to ensure safe delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Action Popup */}
      {showCartActionPopup && (
        <div className={`cart-action-popup ${isCartActionExiting ? 'exiting' : ''}`}>
          <div className="popup-content">
            <div className="popup-header">
              <h3>Item Added to Cart!</h3>
              <button 
                className="popup-close" 
                onClick={() => {
                  setIsCartActionExiting(true);
                  setTimeout(() => {
                    setShowCartActionPopup(false);
                    setIsCartActionExiting(false);
                  }, 300);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="popup-body">
              <div className="cart-action-content">
                <div className="cart-item-preview">
                  <Image
                    src={currentImage}
                    alt="Product"
                    width={60}
                    height={60}
                  />
                  <div className="item-details">
                    <h4>Premium Shahada Metal Car Decal</h4>
                    <p>Color: {selectedColor}</p>
                    <p>Quantity: {quantity}</p>
                    <p className="price">PKR 6,950</p>
                  </div>
                </div>
                <div className="cart-actions">
                  <button 
                    className="continue-shopping"
                    onClick={() => {
                      setIsCartActionExiting(true);
                      setTimeout(() => {
                        setShowCartActionPopup(false);
                        setIsCartActionExiting(false);
                      }, 300);
                    }}
                  >
                    Continue Shopping
                  </button>
                  <button 
                    className="view-cart"
                    onClick={() => {
                      window.location.href = '/pk/cart';
                    }}
                  >
                    View Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}