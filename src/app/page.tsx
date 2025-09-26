'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

export default function Home() {
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState('Gold');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState('/images/goldIndy.jpg');

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
                <h1>DeenDecal</h1>
                <p className="tagline">Express Your Faith</p>
              </div>
              <div className="nav-links">
                <a href="#home">Home</a>
                <a href="#product">Product</a>
                <a href="#installation">Installation</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
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

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Premium Shahada Metal Decal</h1>
              <p>Beautifully crafted Islamic car emblems made from premium materials. Show your devotion with sophistication and grace.</p>
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
          <div className="product-layout">
            <div className="product-gallery">
              <div className="main-image-container">
                <Image
                  src={currentImage}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="main-product-image"
                />
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
                      alt={`${color} variant`}
                      width={80}
                      height={80}
                    />
                    <div className="thumbnail-label">{color}</div>
                  </div>
                ))}
                <div className="thumbnail">
                  <video
                    src="/videos/tiktok_20250926_115253.mp4"
                    className="thumbnail-video"
                    muted
                    loop
                    playsInline
                  />
                  <div className="thumbnail-label">Installation</div>
                </div>
                <div className="thumbnail">
                  <video
                    src="/videos/tiktok_20250926_120529.mp4"
                    className="thumbnail-video"
                    muted
                    loop
                    playsInline
                  />
                  <div className="thumbnail-label">Application</div>
                </div>
                <div className="thumbnail">
                  <video
                    src="/videos/tiktok_20250926_120542.mp4"
                    className="thumbnail-video"
                    muted
                    loop
                    playsInline
                  />
                  <div className="thumbnail-label">Final Result</div>
                </div>
              </div>
            </div>

            <div className="product-info">
              <div className="product-header">
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

              <div className="product-pricing">
                <div className="price-container">
                  <span className="current-price">${product.price}</span>
                  <span className="original-price">${product.originalPrice}</span>
                  <span className="discount-badge">Save {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%</span>
                </div>
                <div className="shipping-info">
                  <i className="fas fa-truck"></i>
                  <span>Free shipping on all orders</span>
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
                    <i className="fas fa-heart"></i>
                    <span>Made with Love</span>
                  </div>
                </div>
              </div>

              <div className="add-to-cart-section">
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  <i className="fas fa-shopping-cart"></i>
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </button>
                <button className="wishlist-btn">
                  <i className="fas fa-heart"></i>
                  Wishlist
                </button>
              </div>

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
                <a href="#"><i className="fab fa-facebook"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
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
              <h4>Support</h4>
              <ul>
                <li><a href="#">Shipping Info</a></li>
                <li><a href="#">Returns</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Size Guide</a></li>
                <li><a href="#">Installation Guide</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact Info</h4>
              <ul>
                <li>Email: info@deendecal.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>Hours: Mon-Fri 9AM-6PM</li>
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