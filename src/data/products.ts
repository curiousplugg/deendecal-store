export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: 'black-indy',
    name: 'Black Indy Decal',
    description: 'Premium black vinyl decal for your vehicle',
    price: 24.99,
    image: '/images/blackIndy.jpg',
    category: 'Decals',
    inStock: true,
  },
  {
    id: 'gold-indy',
    name: 'Gold Indy Decal',
    description: 'Luxurious gold vinyl decal for your vehicle',
    price: 24.99,
    image: '/images/goldIndy.jpg',
    category: 'Decals',
    inStock: true,
  },
  {
    id: 'red-indy',
    name: 'Red Indy Decal',
    description: 'Bold red vinyl decal for your vehicle',
    price: 24.99,
    image: '/images/redIndy.jpg',
    category: 'Decals',
    inStock: true,
  },
  {
    id: 'silver-indy',
    name: 'Silver Indy Decal',
    description: 'Elegant silver vinyl decal for your vehicle',
    price: 24.99,
    image: '/images/silverIndy.jpg',
    category: 'Decals',
    inStock: true,
  },
  {
    id: 'gold-silver-black',
    name: 'Gold Silver Black Combo',
    description: 'Premium three-color combination decal set',
    price: 24.99,
    image: '/images/goldSilverBlack.jpg',
    category: 'Combo Packs',
    inStock: true,
  },
  {
    id: 'red-silver-black',
    name: 'Red Silver Black Combo',
    description: 'Bold three-color combination decal set',
    price: 24.99,
    image: '/images/RedSilverBlack.jpg',
    category: 'Combo Packs',
    inStock: true,
  },
  {
    id: '4ex',
    name: '4ex Special Edition',
    description: 'Exclusive 4ex design decal',
    price: 18.99,
    image: '/images/4ex.jpg',
    category: 'Special Edition',
    inStock: true,
  },
  {
    id: '4withEx',
    name: '4withEx Special Edition',
    description: 'Unique 4withEx design decal',
    price: 18.99,
    image: '/images/4withEx.jpg',
    category: 'Special Edition',
    inStock: true,
  },
  {
    id: 'exOrangeCar',
    name: 'Orange Car Decal',
    description: 'Vibrant orange car decal',
    price: 12.99,
    image: '/images/exOrgangeCar.jpg',
    category: 'Decals',
    inStock: true,
  },
];
