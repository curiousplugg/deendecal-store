export interface PakistaniProduct {
  id: string;
  name: string;
  nameUrdu: string;
  description: string;
  descriptionUrdu: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  categoryUrdu: string;
  inStock: boolean;
  colors: string[];
  selectedColor?: string;
  material: string;
  materialUrdu: string;
  size: string;
  sizeUrdu: string;
  style: string;
  styleUrdu: string;
  installationLocation: string;
  installationLocationUrdu: string;
  packingSpecifications: string[];
  packingSpecificationsUrdu: string[];
  installationInstructions: string[];
  installationInstructionsUrdu: string[];
}

export const pakistaniProducts: PakistaniProduct[] = [
  {
    id: 'shahada-gold-pk',
    name: 'Shahada Metal Car Decal - Islamic Car Emblem (Gold)',
    nameUrdu: 'شہادہ میٹل کار ڈیکل - اسلامی کار کا نشان (سنہرا)',
    description: 'Premium Shahada Metal Car Decal - High-quality metal material, 16*3.5CM size, Trunk Sticker style. Perfect for Body and Rear installation. Single Pack with detailed installation instructions. Durable Islamic car emblem for Muslim car accessories.',
    descriptionUrdu: 'پریمیم شہادہ میٹل کار ڈیکل - اعلیٰ معیار کا دھاتی مواد، 16*3.5CM سائز، ٹرنک اسٹیکر سٹائل۔ جسم اور پیچھے کی تنصیب کے لیے بہترین۔ تفصیلی تنصیبی ہدایات کے ساتھ سنگل پیک۔ مسلم کار کے لوازمات کے لیے پائیدار اسلامی کار کا نشان۔',
    price: 6950,
    originalPrice: 6950,
    image: '/images/goldIndy.jpg',
    category: 'Islamic Car Accessories',
    categoryUrdu: 'اسلامی کار کے لوازمات',
    inStock: true,
    colors: ['Gold', 'Black', 'Red', 'Silver'],
    material: 'Premium Metal',
    materialUrdu: 'پریمیم دھات',
    size: '16*3.5CM',
    sizeUrdu: '16*3.5CM',
    style: 'Trunk Sticker',
    styleUrdu: 'ٹرنک اسٹیکر',
    installationLocation: 'Body and Rear',
    installationLocationUrdu: 'جسم اور پیچھے',
    packingSpecifications: ['Single Pack', 'Detailed Installation Instructions'],
    packingSpecificationsUrdu: ['سنگل پیک', 'تفصیلی تنصیبی ہدایات'],
    installationInstructions: [
      'Clean the area of the vehicle to be applied. Ensure the area is dry, clean, free of oil and moisture, and has not been waxed within three days.',
      'Carefully peel off the protective film from the adhesive backing of the vehicle logo. Align the sticker with the desired area, pressing downward along the logo and pressing firmly.',
      'Do not wash the vehicle within 48 hours of application.'
    ],
    installationInstructionsUrdu: [
      'گاڑی کے اس حصے کو صاف کریں جہاں لگانا ہے۔ یقینی بنائیں کہ جگہ خشک، صاف، تیل اور نمی سے پاک ہے، اور تین دنوں کے اندر ویکس نہیں لگایا گیا۔',
      'گاڑی کے لوگو کی چپکنے والی بیکنگ سے حفاظتی فلم کو احتیاط سے ہٹائیں۔ مطلوبہ جگہ کے ساتھ اسٹیکر کو سیدھا کریں، لوگو کے ساتھ نیچے دبائیں اور مضبوطی سے دبائیں۔',
      'لگانے کے 48 گھنٹوں کے اندر گاڑی کو نہ دھوئیں۔'
    ]
  },
  {
    id: 'shahada-black-pk',
    name: 'Shahada Metal Car Decal - Islamic Car Emblem (Black)',
    nameUrdu: 'شہادہ میٹل کار ڈیکل - اسلامی کار کا نشان (کالا)',
    description: 'Premium Shahada Metal Car Decal - High-quality metal material, 16*3.5CM size, Trunk Sticker style. Perfect for Body and Rear installation. Single Pack with detailed installation instructions. Durable Islamic car emblem for Muslim car accessories.',
    descriptionUrdu: 'پریمیم شہادہ میٹل کار ڈیکل - اعلیٰ معیار کا دھاتی مواد، 16*3.5CM سائز، ٹرنک اسٹیکر سٹائل۔ جسم اور پیچھے کی تنصیب کے لیے بہترین۔ تفصیلی تنصیبی ہدایات کے ساتھ سنگل پیک۔ مسلم کار کے لوازمات کے لیے پائیدار اسلامی کار کا نشان۔',
    price: 6950,
    originalPrice: 6950,
    image: '/images/blackIndy.jpg',
    category: 'Islamic Car Accessories',
    categoryUrdu: 'اسلامی کار کے لوازمات',
    inStock: true,
    colors: ['Gold', 'Black', 'Red', 'Silver'],
    material: 'Premium Metal',
    materialUrdu: 'پریمیم دھات',
    size: '16*3.5CM',
    sizeUrdu: '16*3.5CM',
    style: 'Trunk Sticker',
    styleUrdu: 'ٹرنک اسٹیکر',
    installationLocation: 'Body and Rear',
    installationLocationUrdu: 'جسم اور پیچھے',
    packingSpecifications: ['Single Pack', 'Detailed Installation Instructions'],
    packingSpecificationsUrdu: ['سنگل پیک', 'تفصیلی تنصیبی ہدایات'],
    installationInstructions: [
      'Clean the area of the vehicle to be applied. Ensure the area is dry, clean, free of oil and moisture, and has not been waxed within three days.',
      'Carefully peel off the protective film from the adhesive backing of the vehicle logo. Align the sticker with the desired area, pressing downward along the logo and pressing firmly.',
      'Do not wash the vehicle within 48 hours of application.'
    ],
    installationInstructionsUrdu: [
      'گاڑی کے اس حصے کو صاف کریں جہاں لگانا ہے۔ یقینی بنائیں کہ جگہ خشک، صاف، تیل اور نمی سے پاک ہے، اور تین دنوں کے اندر ویکس نہیں لگایا گیا۔',
      'گاڑی کے لوگو کی چپکنے والی بیکنگ سے حفاظتی فلم کو احتیاط سے ہٹائیں۔ مطلوبہ جگہ کے ساتھ اسٹیکر کو سیدھا کریں، لوگو کے ساتھ نیچے دبائیں اور مضبوطی سے دبائیں۔',
      'لگانے کے 48 گھنٹوں کے اندر گاڑی کو نہ دھوئیں۔'
    ]
  },
  {
    id: 'shahada-red-pk',
    name: 'Shahada Metal Car Decal - Islamic Car Emblem (Red)',
    nameUrdu: 'شہادہ میٹل کار ڈیکل - اسلامی کار کا نشان (سرخ)',
    description: 'Premium Shahada Metal Car Decal - High-quality metal material, 16*3.5CM size, Trunk Sticker style. Perfect for Body and Rear installation. Single Pack with detailed installation instructions. Durable Islamic car emblem for Muslim car accessories.',
    descriptionUrdu: 'پریمیم شہادہ میٹل کار ڈیکل - اعلیٰ معیار کا دھاتی مواد، 16*3.5CM سائز، ٹرنک اسٹیکر سٹائل۔ جسم اور پیچھے کی تنصیب کے لیے بہترین۔ تفصیلی تنصیبی ہدایات کے ساتھ سنگل پیک۔ مسلم کار کے لوازمات کے لیے پائیدار اسلامی کار کا نشان۔',
    price: 6950,
    originalPrice: 6950,
    image: '/images/redIndy.jpg',
    category: 'Islamic Car Accessories',
    categoryUrdu: 'اسلامی کار کے لوازمات',
    inStock: true,
    colors: ['Gold', 'Black', 'Red', 'Silver'],
    material: 'Premium Metal',
    materialUrdu: 'پریمیم دھات',
    size: '16*3.5CM',
    sizeUrdu: '16*3.5CM',
    style: 'Trunk Sticker',
    styleUrdu: 'ٹرنک اسٹیکر',
    installationLocation: 'Body and Rear',
    installationLocationUrdu: 'جسم اور پیچھے',
    packingSpecifications: ['Single Pack', 'Detailed Installation Instructions'],
    packingSpecificationsUrdu: ['سنگل پیک', 'تفصیلی تنصیبی ہدایات'],
    installationInstructions: [
      'Clean the area of the vehicle to be applied. Ensure the area is dry, clean, free of oil and moisture, and has not been waxed within three days.',
      'Carefully peel off the protective film from the adhesive backing of the vehicle logo. Align the sticker with the desired area, pressing downward along the logo and pressing firmly.',
      'Do not wash the vehicle within 48 hours of application.'
    ],
    installationInstructionsUrdu: [
      'گاڑی کے اس حصے کو صاف کریں جہاں لگانا ہے۔ یقینی بنائیں کہ جگہ خشک، صاف، تیل اور نمی سے پاک ہے، اور تین دنوں کے اندر ویکس نہیں لگایا گیا۔',
      'گاڑی کے لوگو کی چپکنے والی بیکنگ سے حفاظتی فلم کو احتیاط سے ہٹائیں۔ مطلوبہ جگہ کے ساتھ اسٹیکر کو سیدھا کریں، لوگو کے ساتھ نیچے دبائیں اور مضبوطی سے دبائیں۔',
      'لگانے کے 48 گھنٹوں کے اندر گاڑی کو نہ دھوئیں۔'
    ]
  },
  {
    id: 'shahada-silver-pk',
    name: 'Shahada Metal Car Decal - Islamic Car Emblem (Silver)',
    nameUrdu: 'شہادہ میٹل کار ڈیکل - اسلامی کار کا نشان (چاندی)',
    description: 'Premium Shahada Metal Car Decal - High-quality metal material, 16*3.5CM size, Trunk Sticker style. Perfect for Body and Rear installation. Single Pack with detailed installation instructions. Durable Islamic car emblem for Muslim car accessories.',
    descriptionUrdu: 'پریمیم شہادہ میٹل کار ڈیکل - اعلیٰ معیار کا دھاتی مواد، 16*3.5CM سائز، ٹرنک اسٹیکر سٹائل۔ جسم اور پیچھے کی تنصیب کے لیے بہترین۔ تفصیلی تنصیبی ہدایات کے ساتھ سنگل پیک۔ مسلم کار کے لوازمات کے لیے پائیدار اسلامی کار کا نشان۔',
    price: 6950,
    originalPrice: 6950,
    image: '/images/silverIndy.jpg',
    category: 'Islamic Car Accessories',
    categoryUrdu: 'اسلامی کار کے لوازمات',
    inStock: true,
    colors: ['Gold', 'Black', 'Red', 'Silver'],
    material: 'Premium Metal',
    materialUrdu: 'پریمیم دھات',
    size: '16*3.5CM',
    sizeUrdu: '16*3.5CM',
    style: 'Trunk Sticker',
    styleUrdu: 'ٹرنک اسٹیکر',
    installationLocation: 'Body and Rear',
    installationLocationUrdu: 'جسم اور پیچھے',
    packingSpecifications: ['Single Pack', 'Detailed Installation Instructions'],
    packingSpecificationsUrdu: ['سنگل پیک', 'تفصیلی تنصیبی ہدایات'],
    installationInstructions: [
      'Clean the area of the vehicle to be applied. Ensure the area is dry, clean, free of oil and moisture, and has not been waxed within three days.',
      'Carefully peel off the protective film from the adhesive backing of the vehicle logo. Align the sticker with the desired area, pressing downward along the logo and pressing firmly.',
      'Do not wash the vehicle within 48 hours of application.'
    ],
    installationInstructionsUrdu: [
      'گاڑی کے اس حصے کو صاف کریں جہاں لگانا ہے۔ یقینی بنائیں کہ جگہ خشک، صاف، تیل اور نمی سے پاک ہے، اور تین دنوں کے اندر ویکس نہیں لگایا گیا۔',
      'گاڑی کے لوگو کی چپکنے والی بیکنگ سے حفاظتی فلم کو احتیاط سے ہٹائیں۔ مطلوبہ جگہ کے ساتھ اسٹیکر کو سیدھا کریں، لوگو کے ساتھ نیچے دبائیں اور مضبوطی سے دبائیں۔',
      'لگانے کے 48 گھنٹوں کے اندر گاڑی کو نہ دھوئیں۔'
    ]
  }
];
