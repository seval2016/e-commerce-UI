import { useState } from "react";
import Categories from "../components/Categories/Categories";
import Products from "../components/Products/Products";
import CampaignSingle from "../components/CampaignSingle/CampaignSingle";
import Pagination from "../components/common/Pagination";

const ShopPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // Örnek sayfa sayısı

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Burada API çağrısı yapılabilir

  };

  return (
    <>
      <Categories />
      <Products />
      <CampaignSingle />
      {/* Pagination */}
      <div className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            size="md"
          />
        </div>
      </div>
    </>
  );
};

export default ShopPage;
