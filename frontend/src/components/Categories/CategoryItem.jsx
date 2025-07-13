import Card from "../common/Card";

// Backend API base URL
const API_BASE_URL = "http://localhost:5000";

// Kategori görsel yolunu backend ile birleştir
const getCategoryImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("/uploads/")) {
    return API_BASE_URL + imagePath;
  }
  return imagePath;
};

const CategoryItem = ({ category }) => {
  return (
    <Card className="group cursor-pointer h-full" padding="p-0">
      <div className="bg-white rounded-2xl shadow-none hover:shadow-none transition-all duration-500 transform hover:-translate-y-3 overflow-hidden border-none h-full">
        {/* Image Container with Background */}
        <div className="relative w-full h-48 bg-[#f7f7f7] flex items-center justify-center">
          <img
            src={getCategoryImageUrl(category.image)}
            alt={category.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Hover Icon */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-white/95 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg">
            <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
            {category.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4 h-12 line-clamp-2">
            En yeni {category.name.toLowerCase()} modellerini keşfedin
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              50+ Ürün
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              4.8/5
            </span>
          </div>
        </div>

        {/* Bottom Border Animation */}
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-500"></div>
      </div>
    </Card>
  );
};

export default CategoryItem;