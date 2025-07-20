import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useData } from "../../../context/DataContext.jsx";
import Reviews from "../../Reviews/Reviews";
import Tabs from "../../common/Tabs";

const ProductTabs = () => {
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
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <div className="text-2xl text-gray-400 mb-2">
            <i className="bi bi-box-seam"></i>
          </div>
          <p className="text-gray-500">Ürün bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { 
      id: "desc", 
      label: "Açıklama",
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Ürün Açıklaması</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed text-base">
              {product.description || "Bu ürün hakkında detaylı bilgi yakında eklenecek."}
            </p>
          </div>
        </div>
      )
    },
    { 
      id: "specs", 
      label: "Özellikler",
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Teknik Özellikler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.material && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Malzeme:</span>
                <span className="text-gray-900 font-medium">{product.material}</span>
              </div>
            )}
            {product.brand && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Marka:</span>
                <span className="text-gray-900 font-medium">{product.brand}</span>
              </div>
            )}
            {product.sku && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">SKU:</span>
                <span className="text-gray-900 font-medium">{product.sku}</span>
              </div>
            )}
            {product.colors && product.colors.length > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Renk Seçenekleri:</span>
                <span className="text-gray-900 font-medium">{product.colors.join(', ')}</span>
              </div>
            )}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Beden Seçenekleri:</span>
                <span className="text-gray-900 font-medium">{product.sizes.join(', ')}</span>
              </div>
            )}
            {product.care && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Bakım Talimatları:</span>
                <span className="text-gray-900 font-medium">{product.care}</span>
              </div>
            )}
          </div>
        </div>
      )
    },
    { 
      id: "reviews", 
      label: "Değerlendirmeler",
      content: <Reviews product={product} />
    }
  ];

  return <Tabs tabs={tabs} />;
};

export default ProductTabs;
