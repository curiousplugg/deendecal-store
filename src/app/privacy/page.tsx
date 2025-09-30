import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: "Privacy Policy - DeenDecal | Islamic Car Emblems",
  description: "Privacy Policy for DeenDecal. Learn how we collect, use, and protect your personal information when you shop with us.",
  keywords: "privacy policy, data protection, DeenDecal privacy, Islamic car emblems privacy",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy - DeenDecal",
    description: "Privacy Policy for DeenDecal. Learn how we collect, use, and protect your personal information.",
    type: 'website',
    url: 'https://deendecal.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="container" style={{ paddingTop: '8rem' }}>
        <div className="privacy-container">
          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-updated">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="privacy-section">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you:</p>
            <ul>
              <li>Create an account or make a purchase</li>
              <li>Contact us for customer support</li>
              <li>Subscribe to our newsletter</li>
            </ul>
            <p><strong>Personal Information:</strong> Name, email address, shipping address, phone number, and payment information.</p>
            <p><strong>Payment Information:</strong> We use Stripe for payment processing. Your payment information is securely handled by Stripe and not stored on our servers.</p>
          </div>

          <div className="privacy-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and our services</li>
              <li>Provide customer support</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>3. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li><strong>Suppliers:</strong> We work with trusted suppliers to fulfill your orders. We share necessary shipping information (name, address) to ensure delivery.</li>
              <li><strong>Payment Processors:</strong> Stripe processes your payments securely.</li>
              <li><strong>Shipping Partners:</strong> To deliver your orders worldwide.</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights.</li>
            </ul>
            <p>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
          </div>

          <div className="privacy-section">
            <h2>4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>
          </div>

          <div className="privacy-section">
            <h2>5. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Remember your preferences</li>
              <li>Analyze website traffic and usage</li>
              <li>Improve user experience</li>
            </ul>
            <p>You can control cookie settings through your browser preferences.</p>
          </div>

          <div className="privacy-section">
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability (where applicable)</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>7. International Transfers</h2>
            <p>As a global business, we may transfer your information to countries outside your residence. We ensure appropriate safeguards are in place for such transfers.</p>
          </div>

          <div className="privacy-section">
            <h2>8. Children's Privacy</h2>
            <p>Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>
          </div>

          <div className="privacy-section">
            <h2>9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
          </div>

          <div className="privacy-section">
            <h2>10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul>
              <li>Email: <a href="mailto:deendecal@gmail.com">deendecal@gmail.com</a></li>
              <li>Website: <a href="https://deendecal.com">deendecal.com</a></li>
            </ul>
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
              <h4>Legal</h4>
              <ul>
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
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
