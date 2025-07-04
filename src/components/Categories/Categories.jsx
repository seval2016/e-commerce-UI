import CategoryItem from "./CategoryItem";
import { categories } from "../../data";

const Categories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All Categories</h2>
          <p className="text-lg text-gray-600">Summer Collection New Modern Design</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {categories.slice(0, 5).map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
