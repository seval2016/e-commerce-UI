import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Yol değiştiğinde anında sayfanın üstüne kaydır
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Ek uyumluluk için document.documentElement.scrollTop da dene
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
};

export default ScrollToTop; 