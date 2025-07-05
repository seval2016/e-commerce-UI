import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { products as productsData } from "../../../data";
import Loading from "../../common/Loading";
import Breadcrumb from "../../common/Breadcrumb";

const ProductBreadcrumb = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const foundProduct = productsData.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);

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
      label: product.name
    }
  ];

  return <Breadcrumb items={breadcrumbItems} />;
};

export default ProductBreadcrumb;