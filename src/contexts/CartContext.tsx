'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product } from '@/data/products';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const CartContext = createContext<{
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
} | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && item.selectedColor === action.payload.selectedColor
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && item.selectedColor === action.payload.selectedColor
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    case 'REMOVE_ITEM':
      // Extract index from the key format: "id-color-index"
      const removeIndex = parseInt(action.payload.split('-').pop() || '0');
      return {
        ...state,
        items: state.items.filter((_, index) => index !== removeIndex),
      };
    case 'UPDATE_QUANTITY':
      // Extract index from the key format: "id-color-index"
      const updateIndex = parseInt(action.payload.id.split('-').pop() || '0');
      return {
        ...state,
        items: state.items.map((item, index) =>
          index === updateIndex
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with cart from localStorage immediately
  const getInitialCart = (): CartItem[] => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        try {
          return JSON.parse(storedCart);
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
    return [];
  };

  const [state, dispatch] = useReducer(cartReducer, { items: getInitialCart() });

  // Load cart from localStorage on initial load (fallback)
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const cartItems: CartItem[] = JSON.parse(storedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []); // Empty dependency array to run only once on mount

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
