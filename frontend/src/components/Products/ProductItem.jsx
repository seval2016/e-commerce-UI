import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useFavorites } from "../../context/FavoritesContext.jsx"; // Favori context'ini import et
import Badge from "../common/Badge.jsx";
import Rating from "../common/Rating.jsx"; // Tekrar eklendi

const ProductItem = ({ productItem }) => {
  const { addToCart, isProductInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites(); // Favori fonksiyonlarını al

  // Backend API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Ürün görsel yolunu backend ile birleştir
  const getProductImageUrl = (imagePath) => {
    if (!imagePath) return "/img/products/default.jpg";
    if (imagePath.startsWith("/uploads/")) return API_BASE_URL + imagePath;
    return imagePath;
  };

  const productPrice = productItem.price || 0;
  const productOldPrice = productItem.originalPrice || 0;
  const productDiscount = productItem.discount || 0;
  const isInCart = isProductInCart(productItem._id);
  const isFav = isFavorite(productItem._id); // Ürünün favori olup olmadığını kontrol et
  const productRating = productItem.rating || 0; // rating eklendi
  const productReviews = productItem.reviews?.length || 0; // .length eklendi


  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group border border-transparent hover:border-blue-200 transition-all duration-300">
      <div className="relative">
        <Link to={`/product/${productItem._id}`}>
          <img
            src={getProductImageUrl(productItem.mainImage)}
            alt={productItem.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => (e.target.src = "/img/products/default.jpg")}
          />
        </Link>
        {productDiscount > 0 && (
          <Badge
            variant="danger"
            className="absolute top-4 left-4"
          >
            -{productDiscount}%
          </Badge>
        )}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => toggleFavorite(productItem)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
              isFav 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white'
            }`}
            title={isFav ? "Favorilerden Kaldır" : "Favorilere Ekle"}
          >
            <i className={`bi ${isFav ? 'bi-heart-fill' : 'bi-heart'}`}></i>
          </button>
          <button
            onClick={() => addToCart(productItem)}
            disabled={isInCart}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
              isInCart
                ? 'bg-green-500 text-white'
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white'
            }`}
            title={isInCart ? "Sepete Eklendi" : "Sepete Ekle"}
          >
            <i className={`bi ${isInCart ? 'bi-check-lg' : 'bi-bag-plus'}`}></i>
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-800 truncate">
          <Link
            to={`/product/${productItem._id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {productItem.name}
          </Link>
        </h3>
        {productItem.category?.name && (
          <p className="text-sm text-gray-500 mt-1">
            {productItem.category.name}
          </p>
        )}
        <div className="my-2">
            <Rating rating={productRating} reviews={productReviews} />
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold text-red-500">
            ₺{productPrice.toLocaleString()}
          </span>
          {productOldPrice > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ₺{productOldPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

ProductItem.propTypes = {
  productItem: PropTypes.object,
};

export default ProductItem;
