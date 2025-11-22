export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  colors?: string[];
  selectedColor?: string;
  material?: string;
  size?: string;
  style?: string;
  installationLocation?: string;
  packingSpecifications?: string;
  installationInstructions?: string[];
}

export const products: Product[] = [
  {
    id: 'shahada-decal',
        name: 'Shahada Metal Car Decal - Islamic Car Emblem',
        description: 'Premium Shahada Metal Car Decal - High-quality metal material, 16*3.5CM size, Trunk Sticker style. Perfect for Body and Rear installation. Single Pack with detailed installation instructions. Durable Islamic car emblem for Muslim car accessories.',
    price: 17.99,
    originalPrice: 40.00,
    image: '/images/goldIndy.jpg',
    category: 'Decals',
    inStock: true,
    colors: ['Gold', 'Black', 'Red', 'Silver'],
    selectedColor: 'Gold',
    material: 'Metal',
    size: '16*3.5CM',
    style: 'Trunk Sticker',
    installationLocation: 'Body, Rear',
    packingSpecifications: 'Single Pack',
    installationInstructions: [
      'Clean the area of the vehicle to be applied. Ensure the area is dry, clean, free of oil and moisture, and has not been waxed within three days.',
      'Carefully peel off the protective film from the adhesive backing of the vehicle logo. Align the sticker with the desired area, pressing downward along the logo and pressing firmly.',
      'Do not wash the vehicle within 48 hours of application.'
    ]
  }
];
