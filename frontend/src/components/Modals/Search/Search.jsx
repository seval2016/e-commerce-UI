import PropTypes from "prop-types";
import Modal from "../../common/Modal";
import Input from "../../common/Input";

const Search = ({ isSearchShow, setIsSearchShow }) => {
  return (
    <Modal 
      isOpen={isSearchShow} 
      onClose={() => setIsSearchShow(false)}
      size="4xl"
      className="p-8"
    >
      <div className="w-full">
        <h3 className="text-3xl font-semibold">Search for products</h3>
        <p className="text-sm text-gray-500 pb-4 border-b border-gray-300">
          Start typing to see products you are looking for.
        </p>
        <form className="mt-4 flex relative after:content-[''] after:w-full after:h-px after:bg-gray-300 after:absolute after:-bottom-4">
          <Input 
            type="text" 
            placeholder="Search a product" 
            className="w-full max-h-[42px] border-gray-300"
          />
          <button className="absolute right-0 h-full px-4 flex items-center justify-center border border-gray-300">
            <i className="bi bi-search text-lg text-gray-500"></i>
          </button>
        </form>
        <div className="mt-8">
          <div className="p-4 bg-gray-50 border border-gray-300">
            <h3 className="text-base font-semibold">RESULTS FROM PRODUCT</h3>
          </div>
          <div className="grid grid-cols-2 border-l border-gray-300 lg:grid-cols-1">
            <a href="#" className="flex gap-4 items-center p-4 border-b border-r border-gray-300 hover:bg-gray-50 transition-colors">
              <img
                src="/img/products/product1/1.png"
                className="max-w-[65px] w-full"
                alt=""
              />
              <div className="text-sm flex flex-col">
                <h4>Analogue Resin Strap</h4>
                <span className="text-gray-500 my-0.5">SKU: PD0016</span>
                <span className="font-semibold text-red-600">$108.00</span>
              </div>
            </a>
            <a href="#" className="flex gap-4 items-center p-4 border-b border-r border-gray-300 hover:bg-gray-50 transition-colors">
              <img
                src="/img/products/product2/1.png"
                className="max-w-[65px] w-full"
                alt=""
              />
              <div className="text-sm flex flex-col">
                <h4>Analogue Resin Strap</h4>
                <span className="text-gray-500 my-0.5">SKU: PD0016</span>
                <span className="font-semibold text-red-600">$108.00</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Search;

Search.propTypes = {
  isSearchShow: PropTypes.bool,
  setIsSearchShow: PropTypes.func,
};