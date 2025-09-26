export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  colors?: string[];
  selectedColor?: string;
}

export const products: Product[] = [
  {
    id: 'indy-decal',
    name: 'Premium Indy Decal',
    description: 'Express your faith with our beautifully crafted vinyl decal. Premium quality, weather-resistant, and easy to install.',
    price: 24.99,
    image: '/images/blackIndy.jpg',
    category: 'Decals',
    inStock: true,
    colors: ['Black', 'Gold', 'Red', 'Silver'],
    selectedColor: 'Black'
  }
];
