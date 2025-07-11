const BrandItem = ({ brand }) => {
  return (
    <div className="opacity-40 hover:opacity-100 transition-opacity duration-200">
      <a href="#" className="block">
        <img src={brand.image} alt={brand.name} className="h-12 md:h-16 object-contain" />
      </a>
    </div>
  );
};

export default BrandItem;