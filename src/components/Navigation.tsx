'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const { state } = useCart();
  const { t, isPakistaniVersion } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  // Fix hydration mismatch by only showing cart count after hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const smoothScrollTo = (elementId: string) => {
    // Check if we're on the cart page or other pages without the sections
    const currentPath = window.location.pathname;
    const basePath = isPakistaniVersion ? '/pk' : '';
    
    if (currentPath === `${basePath}/cart` || currentPath === `${basePath}/faq` || currentPath === `${basePath}/success` || currentPath === `${basePath}/products`) {
      // Redirect to home page first, then scroll to section
      window.location.href = `${basePath || '/'}#${elementId}`;
    } else {
      // We're on the home page, scroll to the section
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <>
      {/* Top Promo Bar */}
      <div className="bg-gray-800 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>{t('nav.free_shipping')}</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <span>{t('nav.track_order')}</span>
              <span>{t('nav.help')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href={isPakistaniVersion ? "/pk" : "/"} className="flex flex-col">
                <span className="text-3xl font-bold" style={{
                  background: 'linear-gradient(135deg, #2c3f51 0%, #c89d24 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: "'Playfair Display', serif"
                }}>DeenDecal</span>
                <span className="text-sm text-gray-500 italic -mt-1">{t('nav.tagline')}</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <button onClick={() => {
                const currentPath = window.location.pathname;
                const basePath = isPakistaniVersion ? '/pk' : '';
                if (currentPath === `${basePath}/cart` || currentPath === `${basePath}/faq` || currentPath === `${basePath}/success`) {
                  window.location.href = basePath || '/';
                } else {
                  smoothScrollTo('home');
                }
              }} className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                {t('nav.home')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full" style={{backgroundColor: '#c89d24'}}></span>
              </button>
              <button onClick={() => smoothScrollTo('product')} className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                {t('nav.products')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full" style={{backgroundColor: '#c89d24'}}></span>
              </button>
              <button onClick={() => smoothScrollTo('installation')} className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                {t('nav.installation')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full" style={{backgroundColor: '#c89d24'}}></span>
              </button>
              <button onClick={() => smoothScrollTo('about')} className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                {t('nav.about')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full" style={{backgroundColor: '#c89d24'}}></span>
              </button>
            </div>

            {/* Desktop Cart and Language Switcher */}
            <div className="hidden lg:flex items-center space-x-4">
              <LanguageSwitcher />
              <Link href={isPakistaniVersion ? "/pk/cart" : "/cart"} className="relative text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:bg-yellow-600" style={{backgroundColor: '#c89d24'}}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.5 5M7 13l2.5 5" />
                </svg>
                <span>{t('nav.cart')}</span>
                {isHydrated && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Cart & Menu Button */}
            <div className="lg:hidden flex items-center space-x-4">
              {/* Mobile Cart */}
              <Link href={isPakistaniVersion ? "/pk/cart" : "/cart"} className="relative text-gray-700 hover:text-yellow-600 transition-colors duration-200 cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.5 5M7 13l2.5 5" />
                </svg>
                {isHydrated && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Hamburger Menu Button */}
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 p-2"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-current transition-all duration-300 mt-1 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-current transition-all duration-300 mt-1 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <div className={`lg:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
              <button
                onClick={() => {
                  const currentPath = window.location.pathname;
                  const basePath = isPakistaniVersion ? '/pk' : '';
                  if (currentPath === `${basePath}/cart` || currentPath === `${basePath}/faq` || currentPath === `${basePath}/success` || currentPath === `${basePath}/products`) {
                    window.location.href = basePath || '/';
                  } else {
                    smoothScrollTo('home');
                  }
                }}
                className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
              >
                {t('nav.home')}
              </button>
              <button
                onClick={() => smoothScrollTo('product')}
                className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
              >
                {t('nav.products')}
              </button>
              <button
                onClick={() => smoothScrollTo('installation')}
                className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
              >
                {t('nav.installation')}
              </button>
              <button
                onClick={() => smoothScrollTo('about')}
                className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
              >
                {t('nav.about')}
              </button>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <Link
                  href={isPakistaniVersion ? "/pk/cart" : "/cart"}
                  className="block px-4 py-3 text-base font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-all duration-200 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.cart')} {isHydrated && totalItems > 0 && `(${totalItems} items)`}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
