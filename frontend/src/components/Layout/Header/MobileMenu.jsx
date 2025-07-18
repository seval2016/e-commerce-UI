import { Link, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../../context/AdminAuthContext.jsx";

const MobileMenu = ({ isOpen, onClose }) => {
  const { pathname } = useLocation();
  const { isAdmin } = useAdminAuth();

  return (
    <>
      {/* Mobile Menu - Soldan Gelen */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-300 transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-900">Menu</h2>
            <button 
              onClick={onClose}
              className="text-2xl text-gray-600 hover:text-gray-900"
            >
              <i className="bi bi-x-circle"></i>
            </button>
          </div>
          <nav className="flex flex-col space-y-6">
            <Link 
              to={"/"} 
              className={`text-lg font-medium transition-colors ${pathname === "/" ? "text-blue-600" : "text-gray-700"}`}
              onClick={onClose}
            >
              Home
            </Link>
            <Link 
              to={"/shop"} 
              className={`text-lg font-medium transition-colors ${pathname === "/shop" ? "text-blue-600" : "text-gray-700"}`}
              onClick={onClose}
            >
              Shop
            </Link>
            <Link 
              to={"/blog"} 
              className={`text-lg font-medium transition-colors ${pathname === "/blog" ? "text-blue-600" : "text-gray-700"}`}
              onClick={onClose}
            >
              Blog
            </Link>
            <Link 
              to={"/contact"} 
              className={`text-lg font-medium transition-colors ${pathname === "/contact" ? "text-blue-600" : "text-gray-700"}`}
              onClick={onClose}
            >
              Contact
            </Link>
            {isAdmin() && (
              <a 
                href={"/admin"} 
                target="_blank"
                rel="noopener noreferrer"
                className={`text-lg font-medium transition-colors ${pathname.startsWith("/admin") ? "text-blue-600" : "text-gray-700"} flex items-center gap-2`}
                onClick={onClose}
              >
                <i className="bi bi-gear-fill"></i>
                Admin
              </a>
            )}
          </nav>
        </div>
      </div>

      {/* Overlay - Mobil menü açıkken arka planı karart */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default MobileMenu; 
