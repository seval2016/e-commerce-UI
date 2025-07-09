import { useState } from "react";
import Proptypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../../context/CartContext.jsx";
import { useAdminAuth } from "../../../context/AdminAuthContext.jsx";
import MobileMenu from "./MobileMenu";
import Dropdown from "../../common/Dropdown";

const Header = ({ setIsSearchShow }) => {
  const { getCartCount } = useCart();
  const { isAdmin } = useAdminAuth();
  const user = localStorage.getItem("user");
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-300 sticky w-full top-0 bg-white z-10">
      <div className="bg-blue-600 py-3.5 text-center text-xs text-white">
        <div className="container mx-auto px-4">
          <p>
            SUMMER SALE FOR ALL SWIM SUITS AND FREE EXPRESS INTERNATIONAL
            DELIVERY - OFF 50%!
            <a href="shop.html" className="text-white font-semibold"> SHOP NOW</a>
          </p>
        </div>
      </div>
      <div className="h-20 flex items-center">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl cursor-pointer md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <i className="bi bi-list" id="btn-menu"></i>
              </button>
            </div>
            <div className="flex-shrink-0">
              <Link to={"/"} className="text-2xl font-bold text-gray-900">
                LOGO
              </Link>
            </div>
            <div className="hidden md:block" id="sidebar">
              <nav className="navigation">
                <ul className="flex gap-8 items-center">
                  <li className="flex items-center relative h-20 group">
                    <Link
                      to={"/"}
                      className={`text-sm font-medium uppercase tracking-wider relative ${
                        pathname === "/" ? "text-blue-600" : "text-gray-700"
                      } group-hover:text-blue-600 transition-colors duration-200`}
                    >
                      Home
                      <i className="bi bi-chevron-down text-xs ml-1"></i>
                    </Link>
                    <div className="absolute top-full left-0 opacity-0 invisible transition-all duration-200 z-10 group-hover:opacity-100 group-hover:visible">
                      <ul className="w-56 bg-white border border-gray-300 flex flex-col py-4">
                        <li>
                          <a href="#" className="flex px-8 py-1 text-sm transition-colors duration-200 hover:text-blue-600">Home Clean</a>
                        </li>
                        <li>
                          <a href="#" className="flex px-8 py-1 text-sm transition-colors duration-200 hover:text-blue-600">Home Collection</a>
                        </li>
                        <li>
                          <a href="#" className="flex px-8 py-1 text-sm transition-colors duration-200 hover:text-blue-600">Home Minimal</a>
                        </li>
                        <li>
                          <a href="#" className="flex px-8 py-1 text-sm transition-colors duration-200 hover:text-blue-600">Home Modern</a>
                        </li>
                        <li>
                          <a href="#" className="flex px-8 py-1 text-sm transition-colors duration-200 hover:text-blue-600">Home Parallax</a>
                        </li>
                        <li>
                          <a href="#" className="flex px-8 py-1 text-sm transition-colors duration-200 hover:text-blue-600">Home Strong</a>
                        </li>
                        <li>
                          <a href="#" className="flex px-8 py-1 text-sm transition-colors duration-200 hover:text-blue-600">Home Style</a>
                        </li>
                        <li>
                          <a href="#" className="flex px-8 py-1 text-sm transition-colors duration-200 hover:text-blue-600">Home Unique</a>
                        </li>
                        <li>
                          <a href="#" className="flex px-8 py-1 text-sm transition-colors duration-200 hover:text-blue-600">Home RTL</a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex items-center relative h-20 group">
                    <Link
                      to={"/shop"}
                      className={`text-sm font-medium uppercase tracking-wider relative ${
                        pathname === "/shop" ? "text-blue-600" : "text-gray-700"
                      } group-hover:text-blue-600 transition-colors duration-200`}
                    >
                      Shop
                      <i className="bi bi-chevron-down text-xs ml-1"></i>
                    </Link>
                    <div className="absolute top-full left-0 opacity-0 invisible transition-all duration-200 z-10 group-hover:opacity-100 group-hover:visible w-full flex justify-center whitespace-nowrap">
                      <div className="bg-white border border-gray-300 p-6 flex gap-12">
                        <div className="flex gap-12">
                          <div>
                            <h3 className="text-base font-medium mb-2">
                              Shop Style
                            </h3>
                            <ul className="flex flex-col gap-1">
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Shop Standard</a>
                              </li>
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Shop Full</a>
                              </li>
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Shop Only Categories</a>
                              </li>
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Shop Image Categories</a>
                              </li>
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Shop Sub Categories</a>
                              </li>
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Shop List</a>
                              </li>
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Hover Style 1</a>
                              </li>
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Hover Style 2</a>
                              </li>
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Hover Style 3</a>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-base font-medium mb-2">
                              Filter Layout
                            </h3>
                            <ul className="flex flex-col gap-1">
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Sidebar</a>
                              </li>
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Filter Side Out</a>
                              </li>
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Filter Dropdown</a>
                              </li>
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Filter Drawer</a>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="text-base font-medium mb-2">
                              Shop Loader
                            </h3>
                            <ul className="flex flex-col gap-1">
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Shop Pagination</a>
                              </li>
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Shop Infinity</a>
                              </li>
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Shop Load More</a>
                              </li>
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Cart Modal</a>
                              </li>
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Cart Drawer</a>
                              </li>
                              <li>
                                <a href="#" className="text-sm transition-colors duration-200 hover:text-blue-600">Cart Page</a>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div>
                          <a href="#">
                            <img src="/img/mega-menu.jpg" alt="" className="w-96 h-64 object-cover rounded-lg" />
                          </a>
                          <h3 className="text-lg font-medium mt-2">
                            JOIN THE LAYERING GANG
                          </h3>
                          <h4 className="text-sm mb-2 font-normal">
                            Suspendisse faucibus nunc et pellentesque
                          </h4>
                          <a
                            href="#"
                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            Shop Now
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="flex items-center relative h-20">
                    <Link
                      to={"/blog"}
                      className={`text-sm font-medium uppercase tracking-wider relative ${
                        pathname === "/blog" ? "text-blue-600" : "text-gray-700"
                      } hover:text-blue-600 transition-colors duration-200`}
                    >
                      Blog
                    </Link>
                  </li>
                  <li className="flex items-center relative h-20">
                    <Link
                      to={"/contact"}
                      className={`text-sm font-medium uppercase tracking-wider relative ${
                        pathname === "/contact" ? "text-blue-600" : "text-gray-700"
                      } hover:text-blue-600 transition-colors duration-200`}
                    >
                      Contact
                    </Link>
                  </li>
                  {isAdmin() && (
                    <li className="flex items-center relative h-20">
                      <a
                        href={"/admin"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm font-medium uppercase tracking-wider relative ${
                          pathname.startsWith("/admin") ? "text-blue-600" : "text-gray-700"
                        } hover:text-blue-600 transition-colors duration-200 flex items-center gap-1`}
                      >
                        <i className="bi bi-gear-fill text-xs"></i>
                        Admin
                      </a>
                    </li>
                  )}
                </ul>
              </nav>
              <i className="bi-x-circle hidden absolute top-4 right-4 text-xl cursor-pointer" id="close-sidebar"></i>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Dropdown
                  trigger={
                    <div className="text-2xl text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                      <i className="bi bi-person-circle"></i>
                    </div>
                  }
                  items={[
                    {
                      label: "Profilim",
                      icon: <i className="bi bi-person"></i>,
                      onClick: () => console.log("Profil")
                    },
                    {
                      label: "Siparişlerim",
                      icon: <i className="bi bi-box"></i>,
                      onClick: () => console.log("Siparişler")
                    },
                    {
                      label: "Favorilerim",
                      icon: <i className="bi bi-heart"></i>,
                      onClick: () => console.log("Favoriler")
                    },
                    { divider: true },
                    {
                      label: "Çıkış Yap",
                      icon: <i className="bi bi-box-arrow-right"></i>,
                      onClick: () => {
                        if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
                          localStorage.removeItem("user");
                          window.location.href = "/";
                        }
                      }
                    }
                  ]}
                  position="bottom"
                />
              ) : (
                <Link to={"/auth"} className="text-2xl text-gray-700 hover:text-blue-600 transition-colors">
                  <i className="bi bi-person"></i>
                </Link>
              )}
              <button
                className="border-none bg-transparent text-lg text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsSearchShow(true)}
              >
                <i className="bi bi-search"></i>
              </button>
              <div className="relative">
                <Link to={"/cart"} className="text-lg text-gray-700 hover:text-blue-600 transition-colors">
                  <i className="bi bi-bag"></i>
                  <span className="w-4 h-4 bg-blue-600 text-white text-xs rounded-full absolute -top-2 -right-2 flex items-center justify-center font-medium">
                    {getCartCount()}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Component */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};

export default Header;

Header.propTypes = {
  setIsSearchShow: Proptypes.func,
};