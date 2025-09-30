import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: "FAQ - Shahada Car Decals | Islamic Car Emblems | DeenDecal",
  description: "Frequently asked questions about our premium Shahada car decals and Islamic car emblems. Shipping, returns, installation, and product information for Muslim car accessories.",
  keywords: "Shahada car decal FAQ, Islamic car emblem questions, Muslim car accessories help, Shahada decal installation, Islamic car emblem shipping, DeenDecal support",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "FAQ - Shahada Car Decals | Islamic Car Emblems",
    description: "Frequently asked questions about our premium Shahada car decals and Islamic car emblems. Shipping, returns, installation, and product information.",
    type: 'website',
    url: 'https://deendecal.com/faq',
  },
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

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

          <div className="faq-section" id="how-we-operate">
            <h2>How We Operate</h2>
            <div className="faq-item">
              <h3>How does DeenDecal work?</h3>
              <p>We act as a trusted middleman, working directly with suppliers worldwide to bring you authentic Islamic car decals. We don't maintain our own warehouse inventory, but instead work closely with our suppliers to ensure you receive high-quality products at competitive prices.</p>
            </div>
            <div className="faq-item">
              <h3>Why do you operate this way?</h3>
              <p>This model allows us to offer you the best prices while maintaining quality standards. We're transparent about this because we believe in honest business practices and want you to know exactly how we bring these products to you.</p>
            </div>
            <div className="faq-item">
              <h3>Does this affect product quality?</h3>
              <p>Not at all. We carefully vet all our suppliers and maintain strict quality standards. Every product goes through our quality assurance process before reaching you.</p>
            </div>
            <div className="faq-item">
              <h3>How do you ensure quality control?</h3>
              <p>We work only with trusted suppliers who meet our strict quality standards. Every order is processed through our quality assurance system, and we handle all customer service to ensure your satisfaction.</p>
            </div>
          </div>

          <div className="faq-section">
            <h2>Returns & Refunds</h2>
            <div className="faq-item">
              <h3>What is your return policy?</h3>
              <p>We do offer money-back guarantees, but you must email us with your reasoning for the return. Please contact us at deendecal@gmail.com with your order number and reason for return.</p>
            </div>
            <div className="faq-item">
              <h3>How do I request a return?</h3>
              <p>To request a return, please email us at deendecal@gmail.com with your order number and a detailed explanation of why you&apos;d like to return the item. We&apos;ll review your request and provide instructions.</p>
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
              <p>You can reach us at deendecal@gmail.com. We typically respond within 24 hours during business days.</p>
            </div>
            <div className="faq-item">
              <h3>Do you offer bulk discounts?</h3>
              <p>Yes! For orders of 10 or more decals, please contact us for special pricing at deendecal@gmail.com.</p>
            </div>
            <div className="faq-item">
              <h3>Are your products authentic Islamic designs?</h3>
              <p>Yes, all our designs are created with respect for Islamic traditions and are approved for use by Muslim customers.</p>
            </div>
          </div>

          <div className="faq-contact">
            <h2>Still Have Questions?</h2>
            <p>If you can&apos;t find the answer you&apos;re looking for, please don&apos;t hesitate to contact us:</p>
            <a href="mailto:deendecal@gmail.com" className="contact-email">
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
                <a href="https://www.instagram.com/deendecal/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                <a href="https://www.tiktok.com/@deendecal" target="_blank" rel="noopener noreferrer"><i className="fab fa-tiktok"></i></a>
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
                <li><Link href="/faq#how-we-operate">How We Operate</Link></li>
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
