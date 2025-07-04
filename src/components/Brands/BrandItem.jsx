const BrandItem = ({ brand }) => {
  return (
    <li className="brand-item">
      <a href="#">
        <img src={brand.image} alt={brand.name} />
      </a>
    </li>
  );
};

export default BrandItem;