import React, { useState } from 'react';

const FavoritesPage = () => {
  const [user] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  // Mock favori ürünler verisi
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: 'Klasik T-Shirt',
      price: 89.99,
      originalPrice: 129.99,
      image: '/img/products/product1/1.png',
      inStock: true,
      rating: 4.5,
      reviews: 124
    },
    {
      id: 2,
      name: 'Denim Ceket',
      price: 199.99,
      originalPrice: 249.99,
      image: '/img/products/product2/1.png',
      inStock: false,
      rating: 4.8,
      reviews: 89
    },
    {
      id: 3,
      name: 'Spor Ayakkabı',
      price: 299.99,
      originalPrice: 399.99,
      image: '/img/products/product3/1.png',
      inStock: true,
      rating: 4.2,
      reviews: 156
    }
  ]);

  const removeFavorite = (productId) => {
    setFavorites(prev => prev.filter(item => item.id !== productId));
  };

  const addToCart = (product) => {
    // TODO: Sepete ekleme işlemi
    console.log('Sepete eklendi:', product);
    alert(`${product.name} sepete eklendi!`);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Giriş Yapın</h1>
          <p className="text-gray-600 mb-6">Favori ürünlerinizi görüntülemek için giriş yapmanız gerekiyor.</p>
          <a href="/auth" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Giriş Yap
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Favorilerim</h1>
          <p className="text-gray-600">Beğendiğiniz ürünleri kolayca bulun ve satın alın</p>
        </div>

        {/* Favorites List */}
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              <i className="bi bi-heart"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz favori ürün yok</h3>
            <p className="text-gray-600 mb-6">Beğendiğiniz ürünleri favorilere ekleyerek buradan kolayca ulaşabilirsiniz.</p>
            <a
              href="/shop"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <i className="bi bi-shop"></i>
              Alışverişe Başla
            </a>
          </div>
        ) : (
          <>
            {/* Favorites Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                <span className="font-semibold">{favorites.length}</span> favori ürün
              </p>
              <button 
                onClick={() => setFavorites([])}
                className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
              >
                Tümünü Temizle
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/img/products/product1/1.png';
                      }}
                    />
                    
                    {/* Remove from Favorites */}
                    <button
                      onClick={() => removeFavorite(product.id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 text-red-500 hover:text-red-600 shadow-md transition-colors"
                      title="Favorilerden Çıkar"
                    >
                      <i className="bi bi-heart-fill text-lg"></i>
                    </button>

                    {/* Stock Status */}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                          Stokta Yok
                        </span>
                      </div>
                    )}

                    {/* Discount Badge */}
                    {product.originalPrice > product.price && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                        %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)} İndirim
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi ${i < Math.floor(product.rating) ? 'bi-star-fill' : 'bi-star'} text-sm`}
                          ></i>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-gray-900">
                        {product.price.toLocaleString()} ₺
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.originalPrice.toLocaleString()} ₺
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          product.inStock
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <i className="bi bi-cart-plus mr-2"></i>
                        {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
                      </button>
                      <a
                        href={`/product/${product.id}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <i className="bi bi-eye"></i>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Related Actions */}
        <div className="mt-12 text-center">
          <div className="inline-flex gap-4">
            <a
              href="/shop"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Alışverişe Devam Et
            </a>
            <a
              href="/cart"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sepeti Görüntüle
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage; 