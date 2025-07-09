import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCartItems([]);
      }
    }
  }, []);

  // Save cart items to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Generate unique cart item ID based on product ID, size, and color
  const generateCartItemId = (productId, size, color) => {
    return `${productId}-${size}-${color}`;
  };

  const addToCart = (product, selectedSize = null, selectedColor = null, quantity = 1) => {
    setCartItems(prevItems => {
      const cartItemId = generateCartItemId(product.id, selectedSize, selectedColor);
      const existingItem = prevItems.find(item => item.cartItemId === cartItemId);
      
      if (existingItem) {
        // If item already exists with same size/color, increase quantity
        return prevItems.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // If item doesn't exist, add new item
        const newItem = {
          id: product.id,
          cartItemId: cartItemId,
          name: product.name || product.title || 'Ürün Adı',
          price: product.price || product.price?.newPrice || 0,
          image: product.image || product.images?.[0] || product.img?.singleImage || '/img/products/product1/1.png',
          quantity: quantity,
          selectedSize: selectedSize,
          selectedColor: selectedColor
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartItemId === cartItemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Check if a product with specific size/color is in cart
  const isProductInCart = (productId, size = null, color = null) => {
    const cartItemId = generateCartItemId(productId, size, color);
    return cartItems.find(item => item.cartItemId === cartItemId);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isProductInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext }; 