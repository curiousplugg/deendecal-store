'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import Navigation from '@/components/Navigation';

export default function Home() {
  const { addItem, state } = useCart();
  const [selectedColor, setSelectedColor] = useState('Gold');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState('/images/goldIndy.jpg');
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  const product = products[0]; // Single product

  const colorImages = {
    'Gold': '/images/goldIndy.jpg',
    'Black': '/images/blackIndy.jpg',
    'Red': '/images/redIndy.jpg',
    'Silver': '/images/silverIndy.jpg'
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCurrentImage(colorImages[color as keyof typeof colorImages] || '/images/goldIndy.jpg');
    setCurrentVideo(null); // Clear video when selecting color
  };

  const handleVideoSelect = (videoSrc: string) => {
    setCurrentVideo(videoSrc);
    setCurrentImage('/images/goldIndy.jpg'); // Keep fallback image
  };

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      selectedColor,
      image: currentImage
    };
    for (let i = 0; i < quantity; i++) {
      addItem(productToAdd);
    }
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DeenDecal",
    "url": "https://deendecal.com",
    "logo": "https://deendecal.com/DDlogo.png",
    "description": "Premium Islamic car emblems and Shahada metal decals. Express your faith with beautifully crafted Islamic car accessories.",
    "sameAs": [
      "https://instagram.com/deendecal",
      "https://tiktok.com/@deendecal"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "info@deendecal.com",
      "contactType": "customer service"
    },
    "offers": {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Product",
        "name": "Shahada Metal Decal",
        "description": "Premium Islamic car emblem made from high-quality metal. Available in Gold, Black, Red, and Silver.",
        "brand": "DeenDecal",
        "category": "Automotive Accessories",
        "image": [
          "https://deendecal.com/images/goldIndy.jpg",
          "https://deendecal.com/images/blackIndy.jpg",
          "https://deendecal.com/images/redIndy.jpg",
          "https://deendecal.com/images/silverIndy.jpg"
        ],
        "offers": {
          "@type": "Offer",
          "price": "24.99",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "0",
              "currency": "USD"
            }
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Promo Banner */}
      <div className="bg-blue-600 text-white py-2 px-4 text-center text-sm">
        <div className="flex items-center justify-center space-x-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Free shipping on all orders</span>
        </div>
      </div>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Premium Shahada Metal Car Decal
                <span className="block text-blue-600">Islamic Car Emblem</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Beautifully crafted Islamic car emblems and Shahada decals made from premium metal materials. 
                Show your devotion with sophistication and grace. Perfect for Muslim car accessories and Islamic car badges.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">10K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">4.9</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#product" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-center">
                  Shop Now
                </Link>
                <Link href="/products" className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 text-center">
                  View All Products
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src={currentImage}
                  alt="Premium Islamic Car Emblem"
                  width={500}
                  height={500}
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                  Premium Quality
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="product" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Gallery */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative bg-gray-50 rounded-lg p-4">
                {currentVideo ? (
                  <video
                    src={currentVideo}
                    className="w-full h-96 object-cover rounded-lg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    onClick={(e) => {
                      const video = e.currentTarget;
                      if (video.paused) {
                        video.play();
                      } else {
                        video.pause();
                      }
                    }}
                  />
                ) : (
                  <Image
                    src={currentImage}
                    alt={`Premium Shahada Metal Car Decal - ${selectedColor} - Islamic Car Emblem`}
                    width={500}
                    height={500}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                )}
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>Premium Quality</span>
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(colorImages).map(([color, image]) => (
                  <div
                    key={color}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedColor === color 
                        ? 'border-blue-500 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleColorSelect(color)}
                  >
                    <Image
                      src={image}
                      alt={`Premium Shahada Metal Car Decal - ${color} - Islamic Car Emblem`}
                      width={80}
                      height={80}
                      className="w-full h-20 object-cover"
                    />
                    <div className="text-center py-1 text-xs font-medium text-gray-700">{color}</div>
                  </div>
                ))}
                
                {/* Video Thumbnails */}
                <div 
                  className="cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
                  onClick={() => handleVideoSelect('/videos/tiktok_20250926_115253.mp4')}
                >
                  <video
                    src="/videos/tiktok_20250926_115253.mp4"
                    className="w-full h-20 object-cover"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div className="text-center py-1 text-xs font-medium text-gray-700">Installation</div>
                </div>
                
                <div 
                  className="cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
                  onClick={() => handleVideoSelect('/videos/tiktok_20250926_120529.mp4')}
                >
                  <video
                    src="/videos/tiktok_20250926_120529.mp4"
                    className="w-full h-20 object-cover"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div className="text-center py-1 text-xs font-medium text-gray-700">Application</div>
                </div>
                
                <div 
                  className="cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
                  onClick={() => handleVideoSelect('/videos/tiktok_20250926_120542.mp4')}
                >
                  <video
                    src="/videos/tiktok_20250926_120542.mp4"
                    className="w-full h-20 object-cover"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div className="text-center py-1 text-xs font-medium text-gray-700">Final Result</div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Product Header */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">(127 reviews)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">New Arrival</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                  <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    Save {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                  </span>
                </div>
                <div className="flex items-center text-green-600 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free shipping on all orders</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Choose Color</label>
                <div className="grid grid-cols-2 gap-3">
                  {product.colors?.map((color) => (
                    <button
                      key={color}
                      className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedColor === color 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleColorSelect(color)}
                    >
                      <div className={`w-6 h-6 rounded-full ${
                        color === 'Gold' ? 'bg-yellow-400' :
                        color === 'Black' ? 'bg-gray-800' :
                        color === 'Red' ? 'bg-red-500' :
                        color === 'Silver' ? 'bg-gray-400' : 'bg-gray-300'
                      }`}></div>
                      <span className="font-medium">{color}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Quantity</label>
                <div className="flex items-center space-x-3">
                  <button
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    className="w-20 h-10 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                  <button
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Weather Resistant</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Easy Installation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Premium Quality</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">Made with Love</span>
                  </div>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="space-y-4">
                <button 
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  onClick={handleAddToCart}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  <span>Add to Cart - ${(product.price * quantity).toFixed(2)}</span>
                </button>
                
                <button className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Add to Wishlist</span>
                </button>
              </div>

              {/* Payment Methods */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-3">We accept all major payment methods</p>
                <div className="flex items-center space-x-4 text-gray-400">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">V</span>
                  </div>
                  <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">M</span>
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                  </div>
                  <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🍎</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section id="installation" className="installation-section">
        <div className="container">
          <div className="section-header">
            <h2>Easy Installation</h2>
            <p>Follow these simple steps to install your emblem</p>
          </div>
          <div className="installation-steps">
            {product.installationInstructions?.map((instruction, index) => (
              <div key={index} className="step">
                <div className="step-number">{index + 1}</div>
                <div className="step-content">
                  <h3>Step {index + 1}</h3>
                  <p>{instruction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About DeenDecal</h2>
              <p>We are passionate about creating beautiful, high-quality Islamic car emblems that allow you to express your faith with pride and elegance.</p>
              <p>Our emblems are crafted using premium materials and advanced manufacturing techniques to ensure durability and beauty that lasts.</p>
              <div className="about-features">
                <div className="feature">
                  <div className="feature-icon">
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="feature-content">
                    <h4>Premium Materials</h4>
                    <p>High-grade vinyl and adhesive</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-icon">
                    <i className="fas fa-truck"></i>
                  </div>
                  <div className="feature-content">
                    <h4>Fast Shipping</h4>
                    <p>Free shipping on orders over $50</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-icon">
                    <i className="fas fa-heart"></i>
                  </div>
                  <div className="feature-content">
                    <h4>Made with Love</h4>
                    <p>Crafted with care and attention to detail</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="about-img-container">
              <Image
                src="/images/measurements.jpg"
                alt="About DeenDecal"
                width={500}
                height={400}
                className="about-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="contact-info">
                <h3>Get in Touch</h3>
                <p>Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
                <a href="mailto:info@deendecal.com" className="contact-email">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h3>DeenDecal</h3>
              <p>Express your faith with beautifully crafted Islamic car emblems. Premium quality, easy installation, and designed to last.</p>
              <div className="social-links">
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-tiktok"></i></a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#product">Product</a></li>
                <li><a href="#installation">Installation</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>FAQ (Shipping Info)</h4>
              <ul>
                <li><a href="/faq">Shipping & Returns</a></li>
                <li><a href="/faq">FAQ</a></li>
              </ul>
            </div>
          </div>
              <div className="footer-bottom">
                <p>&copy; 2025 DeenDecal. All rights reserved.</p>
              </div>
        </div>
      </footer>
    </div>
  );
}