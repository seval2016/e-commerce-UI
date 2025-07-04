import PropTypes from "prop-types";

const Search = ({ isSearchShow, setIsSearchShow }) => {
  return (
    <div className={`absolute top-0 left-0 w-full h-full flex justify-center items-center z-[999] transition-all duration-300 ease-in-out ${
      isSearchShow ? "visible opacity-100" : "invisible opacity-0"
    }`}>
      <div className="max-w-[800px] w-full bg-white fixed z-10 p-8 lg:max-w-[370px]">
        <h3 className="text-3xl font-semibold">Search for products</h3>
        <p className="text-sm text-gray-500 pb-4 border-b border-gray-300">
          Start typing to see products you are looking for.
        </p>
        <form className="mt-4 flex relative after:content-[''] after:w-full after:h-px after:bg-gray-300 after:absolute after:-bottom-4">
          <input 
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
        <i
          className="bi bi-x-circle absolute top-1 right-2.5 text-xl cursor-pointer"
          onClick={() => setIsSearchShow(false)}
        ></i>
      </div>
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setIsSearchShow(false)}
      ></div>
    </div>
  );
};

export default Search;

Search.propTypes = {
  isSearchShow: PropTypes.bool,
  setIsSearchShow: PropTypes.func,
};