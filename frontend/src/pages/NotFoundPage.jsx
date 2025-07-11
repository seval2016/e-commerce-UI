import { Link } from "react-router-dom";
import Button from "../components/common/Button";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-6xl font-bold text-white">404</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sayfa Bulunamadı
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Aradığınız sayfa mevcut değil veya taşınmış olabilir. 
              Ana sayfaya dönerek istediğiniz ürünü bulabilirsiniz.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => window.history.back()}
            >
              <i className="bi bi-arrow-left mr-2"></i>
              Geri Dön
            </Button>
            <Link to="/">
              <Button 
                variant="outline" 
                size="lg"
              >
                <i className="bi bi-house-door mr-2"></i>
                Ana Sayfa
              </Button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Popüler sayfalar:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link 
                to="/shop" 
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Mağaza
              </Link>
              <Link 
                to="/blog" 
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Blog
              </Link>
              <Link 
                to="/contact" 
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                İletişim
              </Link>
              <Link 
                to="/cart" 
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Sepet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 