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
      <section id="product" className="product-section">
        <div className="container">
          <div className="product-content">
            <div className="product-info">
              <h2>{t('product.premium_title')}</h2>
              <p className="product-description">
                {t('product.detailed_description')}
              </p>
              
              <div className="product-price">
                <span className="price">PKR 6,950</span>
                <span className="original-price">PKR 6,950</span>
              </div>

              <div className="product-options">
                <div className="color-selection">
                  <h3>{t('product.select_color')}</h3>
                  <div className="color-options">
                    {Object.entries(colorImages).map(([color, image]) => (
                      <button
                        key={color}
                        className={`color-option ${selectedColor === color ? 'active' : ''}`}
                        onClick={() => handleColorSelect(color)}
                      >
                        <Image
                          src={image}
                          alt={`${color} color`}
                          width={60}
                          height={60}
                        />
                        <span>{color}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="quantity-selection">
                  <h3>{t('product.quantity')}</h3>
                  <div className="quantity-controls">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                </div>
              </div>

              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <i className="fas fa-shopping-cart"></i>
                {t('product.add_to_cart')} - PKR 6,950
              </button>

              <div className="product-features">
                <div className="feature">
                  <i className="fas fa-shipping-fast"></i>
                  <span>{t('product.free_shipping')}</span>
                </div>
                <div className="feature">
                  <i className="fas fa-shield-alt"></i>
                  <span>{t('product.money_back')}</span>
                </div>
                <div className="feature">
                  <i className="fas fa-star"></i>
                  <span>{t('product.premium_quality')}</span>
                </div>
              </div>
            </div>

            <div className="product-image">
              {currentVideo ? (
                <video
                  src={currentVideo}
                  className="main-product-video"
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
                  className="main-product-image"
                />
              )}
              <div className="product-badge">
                <i className="fas fa-star"></i>
                <span>{t('product.premium_badge')}</span>
              </div>
            </div>
          </div>
          
          <div className="thumbnail-gallery">
            {Object.entries(colorImages).map(([color, image]) => (
              <div
                key={color}
                className={`thumbnail ${selectedColor === color ? 'active' : ''}`}
                onClick={() => handleColorSelect(color)}
              >
                <Image
                  src={image}
                  alt={`Premium Shahada Metal Car Decal - ${color} - Islamic Car Emblem`}
                  width={80}
                  height={80}
                />
                <div className="thumbnail-label">{color}</div>
              </div>
            ))}
            <div className="thumbnail thumbnail-video" onClick={() => handleVideoSelect('/videos/tiktok_20250926_115253.mp4')}>
              <video
                src="/videos/tiktok_20250926_115253.mp4"
                className="thumbnail-video"
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/video_installation_thumb.jpg"
              />
              <div className="thumbnail-label">{t('product.installation_video')}</div>
            </div>
            <div className="thumbnail thumbnail-video" onClick={() => handleVideoSelect('/videos/tiktok_20250926_120529.mp4')}>
              <video
                src="/videos/tiktok_20250926_120529.mp4"
                className="thumbnail-video"
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/video_application_thumb.jpg"
              />
              <div className="thumbnail-label">{t('product.application_video')}</div>
            </div>
            <div className="thumbnail thumbnail-video" onClick={() => handleVideoSelect('/videos/tiktok_20250926_120542.mp4')}>
              <video
                src="/videos/tiktok_20250926_120542.mp4"
                className="thumbnail-video"
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/video_final_thumb.jpg"
              />
              <div className="thumbnail-label">{t('product.final_result_video')}</div>
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
                    <p>Free shipping across Pakistan • 1-2 weeks delivery</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-icon">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <div className="feature-content">
                    <h4>Money-Back Guarantee</h4>
                    <p>Full refund within 30 days of purchase</p>
                  </div>
                </div>
              </div>
              <div className="about-transparency">
                <p>If you&apos;re curious about how we operate and want to learn more about our business practices, you can <a href="/pk/faq#how-we-operate">read about our operations here</a>.</p>
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
                <a href="mailto:deendecal@gmail.com" className="contact-email">
                  Contact Us
                </a>
              </div>
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