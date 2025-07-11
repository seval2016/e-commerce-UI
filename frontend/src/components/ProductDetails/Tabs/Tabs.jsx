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
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id, products]);

  const tabs = [
    { 
      id: "desc", 
      label: "Açıklama",
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Ürün Açıklaması</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed text-base">
              {product?.description || "Bu ürün hakkında detaylı bilgi yakında eklenecek."}
            </p>
          </div>
        </div>
      )
    },
    { 
      id: "info", 
      label: "Ek Bilgiler",
      content: (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Ek Bilgiler</h3>
          <div className="overflow-hidden border border-gray-200 rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {product?.colors && product.colors.length > 0 && (
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                      Renk
                    </th>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.colors.join(', ')}
                    </td>
                  </tr>
                )}
                {product?.sizes && product.sizes.length > 0 && (
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50">
                      Beden
                    </th>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.sizes.join(', ')}
                    </td>
                  </tr>
                )}
                {product?.material && (
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50">
                      Malzeme
                    </th>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.material}
                    </td>
                  </tr>
                )}
                {product?.care && (
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50">
                      Bakım
                    </th>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.care}
                    </td>
                  </tr>
                )}
                {product?.sku && (
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50">
                      SKU
                    </th>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.sku}
                    </td>
                  </tr>
                )}
                {product?.category && (
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50">
                      Kategori
                    </th>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.category}
                    </td>
                  </tr>
                )}
                {product?.tags && product.tags.length > 0 && (
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50">
                      Etiketler
                    </th>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.tags.join(', ')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    { 
      id: "reviews", 
      label: "Değerlendirmeler",
      content: <Reviews active="content active" />
    },
  ];

  return <Tabs tabs={tabs} defaultActiveTab="desc" size="lg" />;
};

export default ProductTabs;