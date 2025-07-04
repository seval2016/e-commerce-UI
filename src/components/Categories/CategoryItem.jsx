const CategoryItem = ({ category }) => {
  return (
    <div className="group cursor-pointer">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
        {/* Resim Container */}
        <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        {/* Kategori Adı - Resmin Altında */}
        <div className="p-4 text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {category.name}
          </h3>
        </div>
        
        {/* Hover Icon */}
        <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <i className="bi bi-arrow-right text-gray-800 text-lg"></i>
        </div>
      </div>
    </div>
  );
};

export default CategoryItem;