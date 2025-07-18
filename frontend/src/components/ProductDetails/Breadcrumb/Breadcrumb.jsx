import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useData } from "../../../context/DataContext.jsx";
import Loading from "../../common/Loading";
import Breadcrumb from "../../common/Breadcrumb";

const ProductBreadcrumb = () => {
  const { id } = useParams();
  const { products } = useData();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const foundProduct = products.find(p => p._id === id || p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id, products]);

  if (!product) {
    return <Loading type="dots" text="Ürün yükleniyor..." />;
  }

  const breadcrumbItems = [
    {
      label: "Ana Sayfa",
      href: "/",
      icon: <i className="bi bi-house-door"></i>
    },
    {
      label: "Mağaza",
      href: "/shop"
    },
    {
      label: "Ürünler",
      href: "/shop"
    },
    {
      label: product.name || "Ürün"
    }
  ];

  return <Breadcrumb items={breadcrumbItems} />;
};

export default ProductBreadcrumb;
