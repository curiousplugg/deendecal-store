'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function Navigation() {
  const { state } = useCart();
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
                <span>Free shipping on all orders</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <span>Track Order</span>
              <span>Help</span>
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
              <Link href="/" className="flex flex-col">
                <span className="text-3xl font-bold" style={{
                  background: 'linear-gradient(135deg, #2c3f51 0%, #c89d24 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: "'Playfair Display', serif"
                }}>DeenDecal</span>
                <span className="text-sm text-gray-500 italic -mt-1">Express Your Faith</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full" style={{backgroundColor: '#c89d24'}}></span>
              </Link>
              <Link href="/#product" className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                Products
                <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full" style={{backgroundColor: '#c89d24'}}></span>
              </Link>
              <Link href="/#installation" className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                Installation
                <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full" style={{backgroundColor: '#c89d24'}}></span>
              </Link>
              <Link href="/#about" className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full" style={{backgroundColor: '#c89d24'}}></span>
              </Link>
            </div>

            {/* Desktop Cart */}
            <div className="hidden lg:flex items-center">
              <Link href="/cart" className="relative text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:bg-yellow-600" style={{backgroundColor: '#c89d24'}}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.5 5M7 13l2.5 5" />
                </svg>
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Cart & Menu Button */}
            <div className="lg:hidden flex items-center space-x-4">
              {/* Mobile Cart */}
              <Link href="/cart" className="relative text-gray-700 hover:text-yellow-600 transition-colors duration-200 cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.5 5M7 13l2.5 5" />
                </svg>
                {totalItems > 0 && (
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
              <Link
                href="/"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/#product"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/#installation"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Installation
              </Link>
              <Link
                href="/#about"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <Link
                  href="/cart"
                  className="block px-4 py-3 text-base font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-all duration-200 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cart {totalItems > 0 && `(${totalItems} items)`}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
