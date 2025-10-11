'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface LanguageContextType {
  language: 'en' | 'ur';
  setLanguage: (lang: 'en' | 'ur') => void;
  isPakistaniVersion: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.cart': 'Cart',
    'nav.products': 'Products',
    'nav.installation': 'Installation',
    'nav.about': 'About',
    'nav.faq': 'FAQ',
    'nav.terms': 'Terms',
    'nav.privacy': 'Privacy',
    'nav.tagline': 'Express Your Faith',
    'nav.free_shipping': 'Free shipping on all orders!',
    'nav.track_order': 'Track Order',
    'nav.help': 'Help',
    
    // Product
    'product.title': 'Islamic Car Emblem',
    'product.description': 'Beautiful Islamic car emblem with multiple color options',
    'product.price': 'PKR 6,950',
    'product.add_to_cart': 'Add to Cart',
    'product.select_color': 'Select Color',
    'product.quantity': 'Quantity',
    'product.premium_title': 'Premium Shahada Metal Car Decal',
    'product.detailed_description': 'Premium Shahada Metal Car Decal - High-quality metal material, 16*3.5CM size, Trunk Sticker style. Perfect for Body and Rear installation. Single Pack with detailed installation instructions. Durable Islamic car emblem for Muslim car accessories.',
    'product.free_shipping': 'Free Shipping across Pakistan',
    'product.money_back': '30-Day Money Back Guarantee',
    'product.premium_quality': 'Premium Quality Materials',
    'product.premium_badge': 'Premium Quality',
    'product.installation_video': 'Installation',
    'product.application_video': 'Application',
    'product.final_result_video': 'Final Result',
    
    // Cart
    'cart.title': 'Your Shopping Cart',
    'cart.subtitle': 'Review your items and proceed to checkout',
    'cart.empty': 'Your cart is empty',
    'cart.empty_subtitle': 'Add some beautiful Islamic car emblems to get started',
    'cart.continue_shopping': 'Continue Shopping',
    'cart.proceed_checkout': 'Proceed to Checkout',
    'cart.clear_cart': 'Clear Cart',
    'cart.remove': 'Remove',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.total': 'Total',
    'cart.free': 'Free',
    
    // Checkout
    'checkout.title': 'Complete Your Purchase',
    'checkout.subtitle': 'Secure checkout powered by Stripe',
    
    // Success
    'success.title': 'Payment Successful!',
    'success.subtitle': 'Thank you for your purchase! A confirmation email will be sent to you.',
    'success.contact': 'If you have any questions, please email',
    'success.back_home': 'Back to Home',
    
    // Installation Section
    'installation.title': 'Easy Installation',
    'installation.subtitle': 'Follow these simple steps to install your emblem',
    'installation.step': 'Step',
    'installation.step1_title': 'Step 1',
    'installation.step1_desc': 'Clean the area of the vehicle to be applied. Ensure the area is dry, clean, free of oil and moisture, and has not been waxed within three days.',
    'installation.step2_title': 'Step 2',
    'installation.step2_desc': 'Carefully peel off the protective film from the adhesive backing of the vehicle logo. Align the sticker with the desired area, pressing downward along the logo and pressing firmly.',
    'installation.step3_title': 'Step 3',
    'installation.step3_desc': 'Do not wash the vehicle within 48 hours of application.',

    // About Section
    'about.title': 'About DeenDecal',
    'about.p1': 'We are passionate about creating beautiful, high-quality Islamic car emblems that allow you to express your faith with pride and elegance.',
    'about.p2': 'Our emblems are crafted using premium materials and advanced manufacturing techniques to ensure durability and beauty that lasts.',
    'about.feature1_title': 'Premium Materials',
    'about.feature1_desc': 'High-grade vinyl and adhesive',
    'about.feature2_title': 'Fast Shipping',
    'about.feature2_desc': 'Free shipping across Pakistan • 1-2 weeks delivery',
    'about.feature3_title': 'Money-Back Guarantee',
    'about.feature3_desc': 'Full refund within 30 days of purchase',
    'about.transparency': 'If you\'re curious about how we operate and want to learn more about our business practices, you can read about our operations here.',

    // Contact Section
    'contact.title': 'Get in Touch',
    'contact.description': 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',
    'contact.email': 'deendecal@gmail.com',
    
    // Footer
    'footer.contact': 'Contact',
    'footer.email': 'deendecal@gmail.com',
    'footer.business_hours': 'Business Hours',
    'footer.hours': 'Monday - Friday: 9:00 AM - 6:00 PM (Pakistan Standard Time)',
    'footer.shipping': 'Shipping',
    'footer.shipping_info': 'Free shipping across Pakistan. Delivery in 1-2 weeks.',
  },
  ur: {
    // Navigation
    'nav.home': 'ہوم',
    'nav.cart': 'ٹوکری',
    'nav.products': 'مصنوعات',
    'nav.installation': 'انسٹالیشن',
    'nav.about': 'کے بارے میں',
    'nav.faq': 'سوالات',
    'nav.terms': 'شرائط',
    'nav.privacy': 'پرائیویسی',
    'nav.tagline': 'اپنے ایمان کا اظہار کریں',
    'nav.free_shipping': 'تمام آرڈرز پر مفت شپنگ!',
    'nav.track_order': 'آرڈر ٹریک کریں',
    'nav.help': 'مدد',
    
    // Product
    'product.title': 'اسلامی کار کا نشان',
    'product.description': 'کئی رنگ کے اختیارات کے ساتھ خوبصورت اسلامی کار کا نشان',
    'product.price': '6,950 روپے',
    'product.add_to_cart': 'ٹوکری میں شامل کریں',
    'product.select_color': 'رنگ منتخب کریں',
    'product.quantity': 'مقدار',
    'product.premium_title': 'پریمیم شہادہ میٹل کار ڈیکل',
    'product.detailed_description': 'پریمیم شہادہ میٹل کار ڈیکل - اعلیٰ معیار کا دھاتی مواد، 16*3.5CM سائز، ٹرنک اسٹیکر سٹائل۔ جسم اور پیچھے کی تنصیب کے لیے بہترین۔ تفصیلی تنصیبی ہدایات کے ساتھ سنگل پیک۔ مسلم کار کے لوازمات کے لیے پائیدار اسلامی کار کا نشان۔',
    'product.free_shipping': 'پاکستان بھر میں مفت شپنگ',
    'product.money_back': '30 دن کی رقم واپسی کی گارنٹی',
    'product.premium_quality': 'پریمیم کوالٹی کے مواد',
    'product.premium_badge': 'پریمیم کوالٹی',
    'product.installation_video': 'تنصیب',
    'product.application_video': 'استعمال',
    'product.final_result_video': 'حتمی نتیجہ',
    
    // Hero Section
    'hero.title': 'پریمیم شہادہ میٹل کار ڈیکل - اسلامی کار کا نشان',
    'hero.description': 'پریمیم اسلامی کار کے نشانات اور شہادہ ڈیکلز۔ اپنے ایمان کا اظہار خوبصورتی اور وقار کے ساتھ کریں۔',
    'hero.customers': 'خوشگوار گاہک',
    'hero.rating': 'ریٹنگ',
    'hero.support': 'سپورٹ',
    
    // Shipping
    'shipping.free_shipping': 'تمام آرڈرز پر مفت شپنگ! • 1-2 ہفتوں میں ڈیلیوری',
    
    // Cart
    'cart.title': 'آپ کی خریداری کی ٹوکری',
    'cart.subtitle': 'اپنی اشیاء کا جائزہ لیں اور چیک آؤٹ کے لیے آگے بڑھیں',
    'cart.empty': 'آپ کی ٹوکری خالی ہے',
    'cart.empty_subtitle': 'شروع کرنے کے لیے کچھ خوبصورت اسلامی کار کے نشان شامل کریں',
    'cart.continue_shopping': 'خریداری جاری رکھیں',
    'cart.proceed_checkout': 'چیک آؤٹ کے لیے آگے بڑھیں',
    'cart.clear_cart': 'ٹوکری صاف کریں',
    'cart.remove': 'ہٹائیں',
    'cart.subtotal': 'ذیلی کل',
    'cart.shipping': 'شپنگ',
    'cart.total': 'کل',
    'cart.free': 'مفت',
    
    // Checkout
    'checkout.title': 'اپنی خریداری مکمل کریں',
    'checkout.subtitle': 'براہ کرم نوٹ کریں کہ ادائیگی USD میں Stripe پیمنٹ سسٹم کے ذریعے کی جائے گی',
    
    // Success
    'success.title': 'ادائیگی کامیاب!',
    'success.subtitle': 'آپ کی خریداری کا شکریہ! تصدیقی ای میل آپ کو بھیجی جائے گی۔',
    'success.contact': 'اگر آپ کے کوئی سوالات ہیں، تو برائے کرم ای میل کریں',
    'success.back_home': 'واپس ہوم',
    
    // Installation Section
    'installation.title': 'آسان انسٹالیشن',
    'installation.subtitle': 'اپنے نشان کو انسٹال کرنے کے لیے ان آسان اقدامات پر عمل کریں',
    'installation.step': 'مرحلہ',
    'installation.step1_title': 'مرحلہ 1',
    'installation.step1_desc': 'گاڑی کے اس حصے کو صاف کریں جہاں لگانا ہے۔ یقینی بنائیں کہ جگہ خشک، صاف، تیل اور نمی سے پاک ہے، اور تین دنوں کے اندر ویکس نہیں لگایا گیا۔',
    'installation.step2_title': 'مرحلہ 2',
    'installation.step2_desc': 'گاڑی کے لوگو کی چپکنے والی بیکنگ سے حفاظتی فلم کو احتیاط سے ہٹائیں۔ مطلوبہ جگہ کے ساتھ اسٹیکر کو سیدھا کریں، لوگو کے ساتھ نیچے دبائیں اور مضبوطی سے دبائیں۔',
    'installation.step3_title': 'مرحلہ 3',
    'installation.step3_desc': 'لگانے کے 48 گھنٹوں کے اندر گاڑی کو نہ دھوئیں۔',

    // About Section
    'about.title': 'ڈین ڈیکل کے بارے میں',
    'about.p1': 'ہم خوبصورت، اعلیٰ معیار کے اسلامی کار کے نشانات بنانے کے لیے پرجوش ہیں جو آپ کو فخر اور خوبصورتی کے ساتھ اپنے ایمان کا اظہار کرنے کی اجازت دیتے ہیں۔',
    'about.p2': 'ہمارے نشانات پریمیم مواد اور جدید مینوفیکچرنگ تکنیکوں کا استعمال کرتے ہوئے تیار کیے جاتے ہیں تاکہ پائیداری اور خوبصورتی کو یقینی بنایا جا سکے جو دیرپا ہو۔',
    'about.feature1_title': 'پریمیم مواد',
    'about.feature1_desc': 'اعلیٰ درجے کا ونائل اور چپکنے والا',
    'about.feature2_title': 'تیز شپنگ',
    'about.feature2_desc': 'پاکستان بھر میں مفت شپنگ • 1-2 ہفتوں میں ڈیلیوری',
    'about.feature3_title': 'منی بیک گارنٹی',
    'about.feature3_desc': 'خریداری کے 30 دنوں کے اندر مکمل رقم کی واپسی',
    'about.transparency': 'اگر آپ یہ جاننا چاہتے ہیں کہ ہم کیسے کام کرتے ہیں اور ہماری کاروباری طریقوں کے بارے میں مزید جاننا چاہتے ہیں، تو آپ ہمارے آپریشنز کے بارے میں یہاں پڑھ سکتے ہیں۔',

    // Contact Section
    'contact.title': 'رابطہ کریں',
    'contact.description': 'سوالات ہیں؟ ہم آپ سے سننا پسند کریں گے۔ ہمیں ایک پیغام بھیجیں اور ہم جلد از جلد جواب دیں گے۔',
    'contact.email': 'deendecal@gmail.com',
    
    // Footer
    'footer.contact': 'رابطہ',
    'footer.email': 'deendecal@gmail.com',
    'footer.business_hours': 'کاروباری اوقات',
    'footer.hours': 'پیر - جمعہ: صبح 9:00 - شام 6:00 (پاکستان کا معیاری وقت)',
    'footer.shipping': 'شپنگ',
    'footer.shipping_info': 'پاکستان بھر میں مفت شپنگ۔ 1-2 ہفتوں میں ڈیلیوری۔',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPakistaniVersion = pathname.startsWith('/pk');
  
  // Default to Urdu for Pakistani version, English for international
  const [language, setLanguage] = useState<'en' | 'ur'>(isPakistaniVersion ? 'ur' : 'en');

  // Update language when switching between versions
  useEffect(() => {
    if (isPakistaniVersion) {
      setLanguage('ur');
    } else {
      setLanguage('en');
    }
  }, [isPakistaniVersion]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isPakistaniVersion, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
