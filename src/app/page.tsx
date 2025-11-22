'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import Navigation from '@/components/Navigation';
import { tiktokEvents } from '@/lib/tiktok-events';

// Declare gtag function for Google Ads
declare global {
  interface Window {
    gtag: (...args: any[]) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

export default function Home() {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState('Gold');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState('/images/goldIndy.jpg');
  const [currentVideo, setCurrentVideo] = useState<string | null>('/videos/tiktok_20250926_115253.mp4');
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
    
    // Track AddToCart event
    tiktokEvents.trackAddToCart(productToAdd as unknown as Record<string, string | number | boolean | undefined>, quantity);
    
    // Track Google Ads Add to Cart conversion
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17655278257/7343818286',
        'value': product.price * quantity,
        'currency': 'USD'
      });
    }
    
    // Show notification
    setShowCartNotification(true);
    setTimeout(() => {
      setShowCartNotification(false);
    }, 3000); // Hide after 3 seconds
    
    // Show cart action popup
    setShowCartActionPopup(true);
    setTimeout(() => {
      setIsCartActionExiting(true);
      setTimeout(() => {
        setShowCartActionPopup(false);
        setIsCartActionExiting(false);
      }, 300); // Exit animation duration
    }, 5000); // Hide after 5 seconds
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
      "email": "deendecal@gmail.com",
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
          "price": "17.99",
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
                loading="lazy"
                quality={85}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Section */}
      <section id="product" className="product-section">
        <div className="container">
          {/* Product Header - Moved to top */}
          <div className="product-header-top">
            <div className="product-rating">
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <span className="rating-text">(127 reviews)</span>
            </div>
            <h1 className="product-title">{product.name}</h1>
            <div className="new-badge">New Arrival</div>
          </div>

          <div className="product-layout">
            <div className="product-gallery">
              <div className="main-image-container">
                {currentVideo ? (
                  <video
                    src={currentVideo}
                    className="main-product-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    width={500}
                    height={500}
                    preload="metadata"
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
                    className="main-product-image"
                    priority
                    quality={85}
                    loading="eager"
                  />
                )}
                <div className="product-badge">
                  <i className="fas fa-star"></i>
                  <span>Premium Quality</span>
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
                      loading="lazy"
                      quality={75}
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
                  <div className="thumbnail-label">Installation</div>
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
                  <div className="thumbnail-label">Application</div>
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
                  <div className="thumbnail-label">Final Result</div>
                </div>
                <div className="thumbnail thumbnail-video" onClick={() => handleVideoSelect('/videos/MPEG-4 movie.mp4')}>
                  <video
                    src="/videos/MPEG-4 movie.mp4"
                    className="thumbnail-video"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/images/video_mpeg4_movie_thumb.jpg"
                  />
                  <div className="thumbnail-label">Product Video</div>
                </div>
                <div className="thumbnail thumbnail-video" onClick={() => handleVideoSelect('/videos/MPEG-4 movie 2.mp4')}>
                  <video
                    src="/videos/MPEG-4 movie 2.mp4"
                    className="thumbnail-video"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/images/video_mpeg4_movie2_thumb.jpg"
                  />
                  <div className="thumbnail-label">Product Video 2</div>
                </div>
              </div>
            </div>

            <div className="product-info">
              <div className="product-pricing">
                <div className="price-container">
                  <span className="current-price">${product.price}</span>
                  <span className="original-price">${product.originalPrice}</span>
                  <span className="discount-badge">Save {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%</span>
                </div>
                <div className="shipping-info">
                  <i className="fas fa-truck"></i>
                  <span>Free shipping on all orders! • 1-2 weeks delivery</span>
                </div>
              </div>

              {/* Trust Badges - Mobile Optimized */}
              <div className="trust-badges-mobile">
                <div className="trust-badge-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>Secure Checkout</span>
                </div>
                <div className="trust-badge-item">
                  <i className="fas fa-lock"></i>
                  <span>SSL Protected</span>
                </div>
                <div className="trust-badge-item">
                  <i className="fas fa-undo"></i>
                  <span>30-Day Returns</span>
                </div>
                <div className="trust-badge-item">
                  <i className="fas fa-shipping-fast"></i>
                  <span>Free Shipping</span>
                </div>
              </div>

              {/* Social Proof - Recent Purchases */}
              <div className="social-proof-mobile">
                <div className="social-proof-item">
                  <i className="fas fa-user-circle"></i>
                  <span><strong>Sarah M.</strong> from New York just purchased this</span>
                </div>
                <div className="social-proof-item">
                  <i className="fas fa-user-circle"></i>
                  <span><strong>Ahmed K.</strong> from Dubai purchased 2 hours ago</span>
                </div>
              </div>

              <div className="product-description">
                <p>{product.description}</p>
              </div>

              <div className="product-options">
                <div className="option-group">
                  <label className="option-label">Choose Color</label>
                  <div className="color-options">
                    {product.colors?.map((color) => (
                      <div
                        key={color}
                        className={`color-option ${selectedColor === color ? 'active' : ''}`}
                        onClick={() => handleColorSelect(color)}
                      >
                        <div className={`color-preview ${color.toLowerCase()}`}></div>
                        <span>{color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="option-group">
                  <label className="option-label">Quantity</label>
                  <div className="quantity-selector">
                    <button
                      className="quantity-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="quantity-input"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                    />
                    <button
                      className="quantity-btn"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="product-features">
                <h3>Product Features</h3>
                <div className="features-list">
                  <div className="feature-item">
                    <i className="fas fa-shield-alt"></i>
                    <span>Weather Resistant</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-tools"></i>
                    <span>Easy Installation</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-award"></i>
                    <span>Premium Quality</span>
                  </div>
                  <div className="feature-item">
                    <i className="fas fa-dollar-sign"></i>
                    <span>Money-Back Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Urgency Message */}
              <div className="urgency-message-mobile">
                <i className="fas fa-fire"></i>
                <span>🔥 <strong>Limited Stock!</strong> Only 12 left at this price</span>
              </div>

              <div className="add-to-cart-section">
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  <i className="fas fa-shopping-cart"></i>
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </button>
                
                {/* Cart Action Popup - Mobile: between buttons, Desktop: below both */}
                {showCartActionPopup && (
                  <div className={`cart-action-popup ${isCartActionExiting ? 'cart-action-exit' : ''}`}>
                    <Link href="/cart" className="cart-action-btn">
                      <i className="fas fa-shopping-bag"></i>
                      <span>View Cart</span>
                      <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                )}
                
                <button className="shipping-countries-btn" onClick={() => setShowShippingPopup(true)}>
                  <i className="fas fa-globe"></i>
                  Shipping Countries
                </button>
              </div>

              {/* Sticky Mobile Add to Cart Button */}
              <div className="sticky-mobile-cart">
                <div className="sticky-cart-info">
                  <span className="sticky-price">${(product.price * quantity).toFixed(2)}</span>
                  <span className="sticky-shipping">Free Shipping</span>
                </div>
                <div className="sticky-cart-buttons">
                  <button className="sticky-add-to-cart-btn" onClick={handleAddToCart}>
                    <i className="fas fa-shopping-cart"></i>
                    <span>Add to Cart</span>
                  </button>
                  {showCartActionPopup && (
                    <div className={`sticky-cart-action-popup ${isCartActionExiting ? 'sticky-cart-action-exit' : ''}`}>
                      <Link href="/cart" className="sticky-cart-action-btn">
                        <i className="fas fa-shopping-bag"></i>
                        <span>View Cart</span>
                        <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Cart Notification */}
              {showCartNotification && (
                <div className="cart-notification">
                  <div className="notification-content">
                    <i className="fas fa-check-circle"></i>
                    <span>Item added to cart successfully!</span>
                  </div>
                </div>
              )}

              {/* Shipping Countries Popup */}
              {showShippingPopup && (
                <div className="shipping-popup-overlay" onClick={() => setShowShippingPopup(false)}>
                  <div className="shipping-popup" onClick={(e) => e.stopPropagation()}>
                    <div className="shipping-popup-header">
                      <h3>🌍 Countries We Ship To</h3>
                      <button className="close-btn" onClick={() => setShowShippingPopup(false)}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <div className="shipping-popup-message">
                      <p>🚚 Free shipping on all orders worldwide!</p>
                      <p>📦 Delivery time: 1-2 weeks</p>
                    </div>
                    <div className="shipping-countries-grid">
                      <div className="country-group">
                        <h4>🌍 Middle East & Africa</h4>
                        <div className="countries-list">
                          <span>UAE</span>
                          <span>Saudi Arabia</span>
                          <span>South Africa</span>
                          <span>Nigeria</span>
                          <span>Egypt</span>
                          <span>Pakistan</span>
                          <span>Panama</span>
                          <span>Turkey</span>
                          <span>Morocco</span>
                          <span>Algeria</span>
                          <span>Tunisia</span>
                          <span>Kenya</span>
                        </div>
                      </div>
                      <div className="country-group">
                        <h4>🌍 Americas</h4>
                        <div className="countries-list">
                          <span>United States</span>
                          <span>Canada</span>
                          <span>Mexico</span>
                          <span>Brazil</span>
                          <span>Argentina</span>
                          <span>Chile</span>
                          <span>Colombia</span>
                          <span>Jamaica</span>
                          <span>Trinidad & Tobago</span>
                          <span>Barbados</span>
                          <span>Bahamas</span>
                          <span>Dominican Republic</span>
                          <span>Haiti</span>
                          <span>Puerto Rico</span>
                          <span>Peru</span>
                        </div>
                      </div>
                      <div className="country-group">
                        <h4>🌍 Europe</h4>
                        <div className="countries-list">
                          <span>United Kingdom</span>
                          <span>Germany</span>
                          <span>France</span>
                          <span>Italy</span>
                          <span>Spain</span>
                          <span>Netherlands</span>
                          <span>Belgium</span>
                          <span>Austria</span>
                          <span>Switzerland</span>
                          <span>Sweden</span>
                          <span>Norway</span>
                          <span>Denmark</span>
                          <span>Finland</span>
                          <span>Ireland</span>
                          <span>Portugal</span>
                          <span>Luxembourg</span>
                          <span>Malta</span>
                          <span>Cyprus</span>
                          <span>Estonia</span>
                          <span>Latvia</span>
                          <span>Lithuania</span>
                          <span>Slovenia</span>
                          <span>Slovakia</span>
                          <span>Czech Republic</span>
                          <span>Hungary</span>
                          <span>Poland</span>
                          <span>Romania</span>
                          <span>Bulgaria</span>
                          <span>Croatia</span>
                          <span>Greece</span>
                          <span>Russia</span>
                          <span>Ukraine</span>
                          <span>Belarus</span>
                          <span>Moldova</span>
                          <span>Albania</span>
                          <span>North Macedonia</span>
                          <span>Serbia</span>
                        </div>
                      </div>
                      <div className="country-group">
                        <h4>🌍 Asia-Pacific</h4>
                        <div className="countries-list">
                          <span>Australia</span>
                          <span>Japan</span>
                          <span>South Korea</span>
                          <span>Singapore</span>
                          <span>Hong Kong</span>
                          <span>New Zealand</span>
                          <span>Malaysia</span>
                          <span>Thailand</span>
                          <span>Philippines</span>
                          <span>India</span>
                          <span>China</span>
                          <span>Indonesia</span>
                          <span>Bangladesh</span>
                          <span>Vietnam</span>
                          <span>Taiwan</span>
                          <span>Sri Lanka</span>
                          <span>Nepal</span>
                          <span>Maldives</span>
                          <span>Mongolia</span>
                          <span>Papua New Guinea</span>
                          <span>Vanuatu</span>
                          <span>Solomon Islands</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="payment-methods">
                <p>We accept all major payment methods</p>
                <div className="payment-icons">
                  <i className="fab fa-cc-visa"></i>
                  <i className="fab fa-cc-mastercard"></i>
                  <i className="fab fa-cc-amex"></i>
                  <i className="fab fa-cc-paypal"></i>
                  <i className="fab fa-apple-pay"></i>
                </div>
              </div>

              {/* Customer Reviews Section - Mobile Optimized */}
              <div className="customer-reviews-mobile">
                <h3 className="reviews-title">What Our Customers Say</h3>
                <div className="review-item">
                  <div className="review-header">
                    <div className="review-stars">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <span className="review-author">Mohammed A.</span>
                  </div>
                  <p className="review-text">&quot;Excellent quality! The decal looks amazing on my car. Easy to install and very durable. Highly recommend!&quot;</p>
                  <span className="review-date">Verified Purchase • 2 days ago</span>
                </div>
                <div className="review-item">
                  <div className="review-header">
                    <div className="review-stars">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <span className="review-author">Fatima K.</span>
                  </div>
                  <p className="review-text">&quot;Beautiful design and premium quality. Fast shipping and great customer service. Will order again!&quot;</p>
                  <span className="review-date">Verified Purchase • 5 days ago</span>
                </div>
                <div className="review-item">
                  <div className="review-header">
                    <div className="review-stars">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <span className="review-author">Ahmed S.</span>
                  </div>
                  <p className="review-text">&quot;Perfect size and finish. The gold color is exactly as shown. Very satisfied with my purchase!&quot;</p>
                  <span className="review-date">Verified Purchase • 1 week ago</span>
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
                    <p>Free shipping worldwide • 1-2 weeks delivery</p>
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
                <p>If you&apos;re curious about how we operate and want to learn more about our business practices, you can <a href="/faq#how-we-operate">read about our operations here</a>.</p>
              </div>
            </div>
            <div className="about-img-container">
              <Image
                src="/images/measurements.jpg"
                alt="About DeenDecal"
                width={500}
                height={400}
                className="about-img"
                loading="lazy"
                quality={80}
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
                <li><a href="#home">Home</a></li>
                <li><a href="#product">Product</a></li>
                <li><a href="#installation">Installation</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/faq#how-we-operate">How We Operate</a></li>
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