import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: "Terms of Service - DeenDecal | Islamic Car Emblems",
  description: "Terms of Service for DeenDecal. Read our terms and conditions for purchasing Islamic car emblems and decals.",
  keywords: "terms of service, terms and conditions, DeenDecal terms, Islamic car emblems terms",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Terms of Service - DeenDecal",
    description: "Terms of Service for DeenDecal. Read our terms and conditions for purchasing Islamic car emblems.",
    type: 'website',
    url: 'https://deendecal.com/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="container" style={{ paddingTop: '8rem' }}>
        <div className="terms-container">
          <h1 className="terms-title">Terms of Service</h1>
          <p className="terms-updated">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="terms-section">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using DeenDecal.com (&quot;the Website&quot;) and purchasing our products, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </div>

          <div className="terms-section">
            <h2>2. About Our Business</h2>
            <p>DeenDecal operates as a trusted middleman, working directly with suppliers worldwide to bring you authentic Islamic car decals. We do not maintain our own warehouse inventory but work closely with our suppliers to ensure you receive high-quality products at competitive prices.</p>
            <p>For more information about how we operate, please visit our <Link href="/faq#how-we-operate">How We Operate</Link> section.</p>
          </div>

          <div className="terms-section">
            <h2>3. Products and Services</h2>
            <p>We offer premium Islamic car emblems and decals including:</p>
            <ul>
              <li>Shahada Metal Car Decals in various colors (Gold, Black, Red, Silver)</li>
              <li>High-quality metal material construction</li>
              <li>16*3.5CM size specifications</li>
              <li>Worldwide shipping</li>
            </ul>
            <p>Product images and descriptions are provided by our suppliers. While we strive for accuracy, slight variations may occur.</p>
          </div>

          <div className="terms-section">
            <h2>4. Orders and Payment</h2>
            <p><strong>Order Processing:</strong> All orders are processed through our secure payment system powered by Stripe. Payment is required at the time of purchase.</p>
            <p><strong>Pricing:</strong> All prices are listed in USD and include applicable taxes. We reserve the right to change prices at any time.</p>
            <p><strong>Order Confirmation:</strong> You will receive an email confirmation upon successful order placement.</p>
            <p><strong>Payment Methods:</strong> We accept all major credit cards, debit cards, and other payment methods supported by Stripe.</p>
          </div>

          <div className="terms-section">
            <h2>5. Shipping and Delivery</h2>
            <p><strong>Shipping Times:</strong> Orders typically ship within 1-2 business days and arrive within 2-3 weeks worldwide.</p>
            <p><strong>Free Shipping:</strong> We offer free shipping on all orders with no minimum purchase required.</p>
            <p><strong>International Shipping:</strong> We ship worldwide. International orders may be subject to customs duties and taxes, which are the customer&apos;s responsibility.</p>
            <p><strong>Tracking:</strong> You will receive tracking information via email once your order ships.</p>
            <p><strong>Delivery Issues:</strong> If you experience delivery issues, please contact us immediately at deendecal@gmail.com.</p>
          </div>

          <div className="terms-section">
            <h2>6. Money-Back Guarantee</h2>
            <p><strong>Our Commitment:</strong> DeenDecal stands behind the quality of our Islamic car emblems with a comprehensive money-back guarantee. We are confident in the craftsmanship and durability of our products.</p>
            
            <h3>Guarantee Terms and Conditions:</h3>
            <ul>
              <li><strong>Eligibility:</strong> All purchases are covered by our money-back guarantee within 30 days of delivery</li>
              <li><strong>Documentation Required:</strong> Customers must provide clear photographic evidence and a detailed written explanation of the issue</li>
              <li><strong>Reasonable Justification:</strong> Refund requests must demonstrate legitimate concerns such as manufacturing defects, quality issues, or product non-conformance</li>
              <li><strong>Decision Authority:</strong> All refund decisions remain at the sole discretion of the DeenDecal Team</li>
              <li><strong>Evaluation Process:</strong> Each request is carefully reviewed to ensure it meets our quality standards and warranty criteria</li>
            </ul>
            
            <h3>What We Cover:</h3>
            <ul>
              <li>Manufacturing defects and quality issues</li>
              <li>Product non-conformance to specifications</li>
              <li>Damaged items upon delivery (with photographic proof)</li>
              <li>Significant quality deviations from advertised standards</li>
            </ul>
            
            <h3>What We Do Not Cover:</h3>
            <ul>
              <li>Normal wear and tear from use</li>
              <li>Improper installation or application</li>
              <li>Damage caused by misuse or negligence</li>
              <li>Changes in customer preference or satisfaction without quality issues</li>
              <li>Items damaged after proper installation</li>
            </ul>
            
            <p><strong>Refund Process:</strong> To request a refund, contact us at deendecal@gmail.com with your order number, detailed explanation of the issue, and supporting photographic evidence. Our team will review your request and respond within 5-7 business days.</p>
            
            <p><strong>Final Decision:</strong> The DeenDecal Team reserves the right to approve or deny refund requests based on the reasonableness of the claim, quality of evidence provided, and adherence to our guarantee terms. All decisions are final.</p>
          </div>

          <div className="terms-section">
            <h2>7. Returns and Refunds</h2>
            <p><strong>Return Policy:</strong> We offer money-back guarantees, but you must email us with your reasoning for the return. Please contact us at deendecal@gmail.com with your order number and reason for return.</p>
            <p><strong>Damaged Items:</strong> If your decal arrives damaged, please contact us immediately with photos of the damage. We&apos;ll send you a replacement free of charge.</p>
            <p><strong>Refund Processing:</strong> Approved refunds will be processed within 5-10 business days to your original payment method.</p>
            <p><strong>Return Shipping:</strong> Return shipping costs are the customer&apos;s responsibility unless the item was damaged or defective.</p>
          </div>

          <div className="terms-section">
            <h2>8. Customer Responsibilities</h2>
            <p>Customers are responsible for:</p>
            <ul>
              <li>Providing accurate shipping information</li>
              <li>Ensuring proper installation of products</li>
              <li>Following installation instructions provided</li>
              <li>Contacting us promptly with any issues</li>
              <li>Paying any applicable customs duties or taxes</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>9. Installation and Use</h2>
            <p><strong>Installation Instructions:</strong></p>
            <ol>
              <li>Clean the area of the vehicle to be applied. Ensure the area is dry, clean, free of oil and moisture, and has not been waxed within three days.</li>
              <li>Carefully peel off the protective film from the adhesive backing of the vehicle logo. Align the sticker with the desired area, pressing downward along the logo and pressing firmly.</li>
              <li>Do not wash the vehicle within 48 hours of application.</li>
            </ol>
            <p><strong>Proper Use:</strong> Our products are designed for automotive use. Improper installation or use may void any warranty.</p>
          </div>

          <div className="terms-section">
            <h2>10. Limitation of Liability</h2>
            <p>DeenDecal shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of our products or services.</p>
            <p>Our total liability to you for any damages shall not exceed the amount you paid for the product.</p>
          </div>

          <div className="terms-section">
            <h2>11. Intellectual Property</h2>
            <p>All content on this website, including text, graphics, logos, images, and software, is the property of DeenDecal or our suppliers and is protected by copyright and other intellectual property laws.</p>
          </div>

          <div className="terms-section">
            <h2>12. Privacy</h2>
            <p>Your privacy is important to us. Please review our <Link href="/privacy">Privacy Policy</Link>, which also governs your use of the Website.</p>
          </div>

          <div className="terms-section">
            <h2>13. Modifications</h2>
            <p>We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date. Your continued use of our services constitutes acceptance of any changes.</p>
          </div>

          <div className="terms-section">
            <h2>14. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.</p>
          </div>

          <div className="terms-section">
            <h2>15. Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us:</p>
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
