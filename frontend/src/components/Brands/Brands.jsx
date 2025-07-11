import BrandItem from "./BrandItem";
import { brands } from "../../data";

const Brands = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="border border-gray-200 rounded-lg p-8">
          <div className="flex justify-between items-center flex-wrap gap-8">
            {brands.map((brand) => (
              <BrandItem key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;
