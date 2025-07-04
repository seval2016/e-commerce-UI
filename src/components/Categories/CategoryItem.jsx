const CategoryItem = ({ category }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <a href="#" className="block p-8 text-center">
        <div className="relative overflow-hidden rounded-lg mb-6">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <span className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
          {category.name}
        </span>
      </a>
    </div>
  );
};

export default CategoryItem;