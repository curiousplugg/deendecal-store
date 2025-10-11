'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { pakistaniProducts, PakistaniProduct } from '@/data/pakistani-products';
import { tiktokEvents } from '@/lib/tiktok-events';

export default function PakistaniProductsPage() {
  const { addItem } = useCart();
  const { t, language } = useLanguage();
  const [selectedProducts, setSelectedProducts] = useState<{[key: string]: {color: string, quantity: number}}>({});

  const handleColorSelect = (productId: string, color: string) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        color: color
      }
    }));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: Math.max(1, quantity)
      }
    }));
  };

  const handleAddToCart = (product: PakistaniProduct) => {
    const selection = selectedProducts[product.id];
    if (!selection || !selection.color || !selection.quantity) {
      alert('Please select color and quantity');
      return;
    }

    // Convert PakistaniProduct to Product format for cart
    const productToAdd = { 
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      inStock: product.inStock,
      colors: product.colors,
      selectedColor: selection.color,
      material: product.material,
      size: product.size,
      style: product.style,
      installationLocation: product.installationLocation,
      packingSpecifications: product.packingSpecifications.join(', '),
      installationInstructions: product.installationInstructions,
      quantity: selection.quantity
    };
    
    for (let i = 0; i < selection.quantity; i++) {
      addItem(productToAdd);
    }

    // Track AddToCart event
    tiktokEvents.trackAddToCart(productToAdd as unknown as Record<string, string | number | boolean | undefined>, selection.quantity);

    alert('Product added to cart!');
  };

  const getProductName = (product: PakistaniProduct) => {
    return language === 'ur' ? product.nameUrdu : product.name;
  };

  const getProductDescription = (product: PakistaniProduct) => {
    return language === 'ur' ? product.descriptionUrdu : product.description;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'ur' ? 'ہماری مصنوعات' : 'Our Products'}
            </h1>
            <p className="text-xl text-gray-600">
              {language === 'ur' ? 'اعلیٰ معیار کے اسلامی کار کے نشانات' : 'Premium Quality Islamic Car Emblems'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pakistaniProducts.map((product) => {
              const selection = selectedProducts[product.id] || { color: '', quantity: 1 };
              const colorImages = {
                'Gold': '/images/goldIndy.jpg',
                'Black': '/images/blackIndy.jpg',
                'Red': '/images/redIndy.jpg',
                'Silver': '/images/silverIndy.jpg'
              };

              return (
                <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <Image
                      src={selection.color ? colorImages[selection.color as keyof typeof colorImages] || product.image : product.image}
                      alt={getProductName(product)}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {language === 'ur' ? 'پریمیم کوالٹی' : 'Premium Quality'}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {getProductName(product)}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                      {getProductDescription(product)}
                    </p>

                    <div className="mb-4">
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        PKR {product.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Color Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('product.select_color')}
                      </label>
                      <div className="flex space-x-2">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => handleColorSelect(product.id, color)}
                            className={`w-8 h-8 rounded-full border-2 ${
                              selection.color === color 
                                ? 'border-yellow-500 ring-2 ring-yellow-200' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                            style={{
                              backgroundColor: color === 'Gold' ? '#FFD700' : 
                                             color === 'Black' ? '#000000' : 
                                             color === 'Red' ? '#FF0000' : 
                                             color === 'Silver' ? '#C0C0C0' : '#FFFFFF'
                            }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Quantity Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('product.quantity')}
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(product.id, selection.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                          disabled={selection.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{selection.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(product.id, selection.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                      disabled={!selection.color}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.5 5M7 13l2.5 5" />
                      </svg>
                      <span>{t('product.add_to_cart')}</span>
                    </button>

                    <div className="mt-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-2 mb-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{t('product.free_shipping')}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{t('product.money_back')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span>{t('product.premium_quality')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/pk/cart" 
              className="inline-flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.5 5M7 13l2.5 5" />
              </svg>
              <span>{t('nav.cart')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
