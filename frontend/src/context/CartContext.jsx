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

  // localStorage kullanımını kontrol et ve gereksiz anahtarları temizle (sadece development'ta)
  const _checkStorageUsage = () => {
    if (import.meta.env.DEV) {
      try {
        let totalSize = 0;
        const keysToKeep = ['cart']; // Sadece bu anahtarları koru
        
        // Gereksiz anahtarları temizle
        for (let key in localStorage) {
          if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
            if (!keysToKeep.includes(key)) {

              localStorage.removeItem(key);
            } else {
              totalSize += localStorage[key].length;
            }
          }
        }
        

        return totalSize;
      } catch (error) {

        return 0;
      }
    }
  };

  // Load cart items from localStorage on mount
  useEffect(() => {
    try {
      // Uygulama başlatıldığında gereksiz localStorage anahtarlarını temizle
      const keysToKeep = ['cart', 'adminUser'];
      for (let key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key) && !keysToKeep.includes(key)) {

          localStorage.removeItem(key);
        }
      }
      
      // Önce localStorage'dan dene
      let savedCart = localStorage.getItem('cart');
      
      // Eğer localStorage'da yoksa sessionStorage'dan dene
      if (!savedCart) {
        savedCart = sessionStorage.getItem('cart');
      }
      
      if (savedCart) {
        const parsedData = JSON.parse(savedCart);
        
        // Eğer sıkıştırılmış veri ise (kısa property isimleri varsa)
        if (parsedData.length > 0 && parsedData[0].i) {
          // Sıkıştırılmış veriyi aç
          const expandedData = parsedData.map(item => ({
            id: item.i,
            cartItemId: item.c,
            name: item.n,
            price: item.p,
            image: item.img,
            quantity: item.q,
            selectedSize: item.s,
            selectedColor: item.cl
          }));
          setCartItems(expandedData);
        } else {
          // Normal veri formatı
          setCartItems(parsedData);
        }
      }
    } catch (error) {

      setCartItems([]);
    }
  }, []);

  // Save cart items to localStorage whenever cart changes
  useEffect(() => {
    try {
      // Storage kullanımını kontrol et
      _checkStorageUsage();
      
      // Veriyi sıkıştır ve optimize et
      const cartData = cartItems.map(item => ({
        i: item.id, // id
        c: item.cartItemId, // cartItemId
        n: item.name, // name
        p: item.price, // price
        img: item.image, // image
        q: item.quantity, // quantity
        s: item.selectedSize, // selectedSize
        cl: item.selectedColor // selectedColor
      }));
      
      const compressedData = JSON.stringify(cartData);
      if (import.meta.env.DEV) {

      }
      
      // localStorage'a kaydet
      localStorage.setItem('cart', compressedData);
    } catch (error) {

      
      // Eğer quota exceeded hatası ise, localStorage'ı tamamen temizle ve tekrar dene
      if (error.name === 'QuotaExceededError') {
        try {

          
          // Tüm localStorage'ı temizle
          localStorage.clear();
          
          // Sadece cart verisini kaydet
          const cartData = cartItems.map(item => ({
            i: item.id,
            c: item.cartItemId,
            n: item.name,
            p: item.price,
            img: item.image,
            q: item.quantity,
            s: item.selectedSize,
            cl: item.selectedColor
          }));
          
          localStorage.setItem('cart', JSON.stringify(cartData));

          
        } catch (retryError) {

          
          // Son çare: sessionStorage kullan
          try {

            sessionStorage.setItem('cart', JSON.stringify(cartItems));

          } catch (sessionError) {

            // En son çare: memory'de tut (sayfa yenilenince kaybolur)

          }
        }
      }
    }
  }, [cartItems]);

  // Generate unique cart item ID based on product ID, size, and color
  const generateCartItemId = (productId, size, color) => {
    return `${productId}-${size}-${color}`;
  };

  const addToCart = (product, selectedSize = null, selectedColor = null, quantity = 1) => {
    setCartItems(prevItems => {
      const productId = product._id || product.id;
      
      // Aynı ürünün aynı beden ve renk kombinasyonu sepette var mı kontrol et
      const existingProduct = prevItems.find(
        item =>
          item.id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );
      if (existingProduct) {
        // Eğer aynı ürün, beden ve renk kombinasyonu sepette varsa, miktarını artır
        return prevItems.map(item =>
          item.id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Eğer bu kombinasyon sepette yoksa, yeni ürün ekle
        const cartItemId = generateCartItemId(productId, selectedSize, selectedColor);
        const newItem = {
          id: productId,
          cartItemId: cartItemId,
          name: product.name || product.title || 'Ürün Adı',
          price: typeof product.price === 'number' ? product.price : (product.price?.newPrice || 0),
          image: product.image || product.images?.[0]?.url || product.mainImage || product.img?.singleImage || '/img/products/product1/1.png',
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
