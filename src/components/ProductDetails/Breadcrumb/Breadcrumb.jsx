import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import productsData from "../../../data.json";

const Breadcrumb = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const foundProduct = productsData.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);

  if (!product) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"
          >
            <i className="bi bi-house-door mr-2"></i>
            Ana Sayfa
          </Link>
        </li>
        <li>
          <div className="flex items-center">
            <i className="bi bi-chevron-right text-gray-400 mx-2"></i>
            <Link 
              to="/shop" 
              className="text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              Mağaza
            </Link>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <i className="bi bi-chevron-right text-gray-400 mx-2"></i>
            <Link 
              to="/shop" 
              className="text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              Ürünler
            </Link>
          </div>
        </li>
        <li aria-current="page">
          <div className="flex items-center">
            <i className="bi bi-chevron-right text-gray-400 mx-2"></i>
            <span className="text-sm font-medium text-gray-500 truncate max-w-xs">
              {product.name}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;