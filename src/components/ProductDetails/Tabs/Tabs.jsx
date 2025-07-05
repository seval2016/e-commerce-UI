import Reviews from "../../Reviews/Reviews";
import Tabs from "../../common/Tabs";

const ProductTabs = () => {
  const tabs = [
    { 
      id: "desc", 
      label: "Açıklama",
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Ürün Açıklaması</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed text-base">
              Quisque varius diam vel metus mattis, id aliquam diam rhoncus. Proin
              vitae magna in dui finibus malesuada et at nulla. Morbi elit ex,
              viverra vitae ante vel, blandit feugiat ligula. Fusce fermentum
              iaculis nibh, at sodales leo maximus a. Nullam ultricies sodales
              nunc, in pellentesque lorem mattis quis. Cras imperdiet est in nunc
              tristique lacinia. Nullam aliquam mauris eu accumsan tincidunt.
              Suspendisse velit ex, aliquet vel ornare vel, dignissim a tortor.
            </p>
            <p className="text-gray-600 leading-relaxed text-base">
              Quisque varius diam vel metus mattis, id aliquam diam rhoncus. Proin
              vitae magna in dui finibus malesuada et at nulla. Morbi elit ex,
              viverra vitae ante vel, blandit feugiat ligula. Fusce fermentum
              iaculis nibh, at sodales leo maximus a. Nullam ultricies sodales
              nunc, in pellentesque lorem mattis quis. Cras imperdiet est in nunc
              tristique lacinia. Nullam aliquam mauris eu accumsan tincidunt.
              Suspendisse velit ex, aliquet vel ornare vel, dignissim a tortor.
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
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50 w-1/3">
                    Renk
                  </th>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    Apple Red, Bio Blue, Sweet Orange, Blue, Green, Pink, Black, White
                  </td>
                </tr>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50">
                    Beden
                  </th>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    XXS, XS, S, M, L, XL, XXL
                  </td>
                </tr>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50">
                    Malzeme
                  </th>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    %100 Pamuk
                  </td>
                </tr>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900 bg-gray-50">
                    Bakım
                  </th>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    30°C'de yıkayın, ütülemeyin
                  </td>
                </tr>
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