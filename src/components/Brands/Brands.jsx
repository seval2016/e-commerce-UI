import BrandItem from "./BrandItem";
import "./Brands.css";
import { brands } from "../../data";

const Brands = () => {
  return (
    <section className="brands">
      <div className="container">
        <ul className="brand-list">
          {brands.map((brand) => (
            <BrandItem key={brand.id} brand={brand} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Brands;
