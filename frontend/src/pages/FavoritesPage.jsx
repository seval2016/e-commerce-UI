import { useFavorites } from '../context/FavoritesContext';
import Breadcrumb from '../components/common/Breadcrumb';
import ProductItem from '../components/Products/ProductItem';
import { Link } from 'react-router-dom';
import { Popconfirm } from 'antd';

const FavoritesPage = () => {
  const { favorites, clearFavorites } = useFavorites();

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <Breadcrumb />

        {/* Header */}
        <div className="my-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600">The products you love, all in one place.</p>
        </div>

        {/* Favorites List */}
        {favorites.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <div className="text-gray-400 text-6xl mb-4">
              <i className="bi bi-heart"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">You have no favorite items yet</h3>
            <p className="text-gray-600 mb-6">Click the heart icon on a product to add it to your favorites.</p>
            <Link
              to="/shop"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <i className="bi bi-shop"></i>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div>
            {/* Favorites Count & Clear Button */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">{favorites.length}</span> favorite items
              </p>
              <Popconfirm
                title="Are you sure you want to clear all favorites?"
                onConfirm={clearFavorites}
                okText="Yes, Clear All"
                cancelText="No"
              >
                <button 
                  className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                >
                  Clear All
                </button>
              </Popconfirm>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favorites.map((product) => (
                <ProductItem key={product._id} productItem={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage; 