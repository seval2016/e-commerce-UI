import Categories from "../components/Categories/Categories";
import Products from "../components/Products/Products";
import CampaignSingle from "../components/CampaignSingle/CampaignSingle";

const ShopPage = () => {
  return (
    <>
      <Categories />
      <Products />
      <CampaignSingle />
      <Products />
    </>
  );
};

export default ShopPage;