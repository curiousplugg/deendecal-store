'use client';

import React from 'react';
import Link from 'next/link';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="header">
        <div className="header-top">
          <div className="container">
            <div className="header-top-content">
              <div className="promo-banner">
                <i className="fas fa-gift"></i>
                <span>Free shipping on all orders</span>
              </div>
              <div className="header-top-links">
                <a href="#">Track Order</a>
                <a href="#">Help</a>
                <a href="#">Contact</a>
              </div>
            </div>
          </div>
        </div>
        <nav className="main-nav">
          <div className="container">
            <div className="nav-content">
              <div className="logo">
                <Link href="/">
                  <h1>DeenDecal</h1>
                  <p className="tagline">Express Your Faith</p>
                </Link>
              </div>
              <div className="nav-links">
                <Link href="/#home">Home</Link>
                <Link href="/#product">Product</Link>
                <Link href="/#installation">Installation</Link>
                <Link href="/#about">About</Link>
                <Link href="/#contact">Contact</Link>
              </div>
              <div className="nav-actions">
                <Link href="/cart" className="cart-btn">
                  <i className="fas fa-shopping-cart"></i>
                  <span>Cart</span>
                  <span className="cart-count">0</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="container" style={{ paddingTop: '8rem' }}>
        <div className="faq-container">
          <h1 className="faq-title">Frequently Asked Questions</h1>
          
          <div className="faq-section">
            <h2>Shipping Information</h2>
            <div className="faq-item">
              <h3>How long does shipping take?</h3>
              <p>Shipping typically takes 2 to 3 weeks. We ship from our facility and process orders within 1-2 business days.</p>
            </div>
            <div className="faq-item">
              <h3>Is shipping really free?</h3>
              <p>Yes! We offer free shipping on all orders, no minimum purchase required. This applies to all domestic and international orders.</p>
            </div>
            <div className="faq-item">
              <h3>Do you ship internationally?</h3>
              <p>Yes, we ship worldwide. International shipping also takes 2-3 weeks and is completely free.</p>
            </div>
            <div className="faq-item">
              <h3>How can I track my order?</h3>
              <p>Once your order ships, you&apos;ll receive a tracking number via email. You can track your package using the provided tracking number.</p>
            </div>
          </div>

          <div className="faq-section">
            <h2>Returns & Refunds</h2>
            <div className="faq-item">
              <h3>What is your return policy?</h3>
              <p>We do offer money-back guarantees, but you must email us with your reasoning for the return. Please contact us at info@deendecal.com with your order number and reason for return.</p>
            </div>
            <div className="faq-item">
              <h3>How do I request a return?</h3>
              <p>To request a return, please email us at info@deendecal.com with your order number and a detailed explanation of why you&apos;d like to return the item. We&apos;ll review your request and provide instructions.</p>
            </div>
            <div className="faq-item">
              <h3>What if my decal is damaged during shipping?</h3>
              <p>If your decal arrives damaged, please contact us immediately with photos of the damage. We&apos;ll send you a replacement free of charge.</p>
            </div>
          </div>

          <div className="faq-section">
            <h2>Product Information</h2>
            <div className="faq-item">
              <h3>What material are the decals made from?</h3>
              <p>Our Shahada Metal Decals are made from high-quality metal material, ensuring durability and weather resistance.</p>
            </div>
            <div className="faq-item">
              <h3>What size are the decals?</h3>
              <p>Our decals are 16*3.5CM in size, perfect for most vehicle applications.</p>
            </div>
            <div className="faq-item">
              <h3>How do I install the decal?</h3>
              <p>Installation is simple: 1) Clean the surface, 2) Peel and apply the decal, 3) Smooth out any air bubbles. Do not wash your vehicle for 48 hours after installation.</p>
            </div>
            <div className="faq-item">
              <h3>Will the decal damage my car&apos;s paint?</h3>
              <p>No, our decals are designed to be removable without damaging your vehicle&apos;s paint when properly installed and removed.</p>
            </div>
          </div>

          <div className="faq-section">
            <h2>General Questions</h2>
            <div className="faq-item">
              <h3>How do I contact customer support?</h3>
              <p>You can reach us at info@deendecal.com. We typically respond within 24 hours during business days.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer bulk discounts?</h3>
              <p>Yes! For orders of 10 or more decals, please contact us for special pricing at info@deendecal.com.</p>
            </div>
            <div className="faq-item">
              <h3>Are your products authentic Islamic designs?</h3>
              <p>Yes, all our designs are created with respect for Islamic traditions and are approved for use by Muslim customers.</p>
            </div>
          </div>

          <div className="faq-contact">
            <h2>Still Have Questions?</h2>
            <p>If you can't find the answer you're looking for, please don't hesitate to contact us:</p>
            <a href="mailto:info@deendecal.com" className="contact-email">
              <i className="fas fa-envelope"></i>
              Contact Us
            </a>
          </div>
        </div>
      </div>

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
                <li><Link href="/#home">Home</Link></li>
                <li><Link href="/#product">Product</Link></li>
                <li><Link href="/#installation">Installation</Link></li>
                <li><Link href="/#about">About</Link></li>
                <li><Link href="/#contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>FAQ (Shipping Info)</h4>
              <ul>
                <li><Link href="/faq">Shipping & Returns</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 DeenDecal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
