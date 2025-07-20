import { Link, useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useData } from '../../context/DataContext';

const Breadcrumb = () => {
    const location = useLocation();
    const params = useParams();
    const { products, blogs } = useData();

    const pathnames = location.pathname.split('/').filter((x) => x);

    const breadcrumbItems = [
        { label: 'Home', href: '/', icon: <i className="bi bi-house-door"></i> }
    ];

    let currentLink = '';
    pathnames.forEach((name, index) => {
        currentLink += `/${name}`;
        const isLast = index === pathnames.length - 1;

        let label = name.charAt(0).toUpperCase() + name.slice(1);

        // Dinamik yolları işle (örn: /product/:id)
        if (params.id && name === params.id) {
            const product = products.find(p => p._id === params.id);
            if (product) label = product.name;
        }
        if (params.slug && name === params.slug) {
            const blog = blogs.find(b => b.slug === params.slug);
            if (blog) label = blog.title;
        }
        
        // "Ürünler" gibi ara yolları ekleyebiliriz
        if (location.pathname.startsWith('/product/') && index === 0) {
            breadcrumbItems.push({ label: 'Products', href: '/shop' });
        }


        breadcrumbItems.push({
            label: label,
            href: isLast ? null : currentLink,
        });
    });
    
    // Tekrarlı yolları temizle (örn: Shop > Products > Ürün Adı yerine Shop > Ürün Adı)
    const uniqueBreadcrumbItems = breadcrumbItems.reduce((acc, current) => {
        if (!acc.find(item => item.label === current.label)) {
            acc.push(current);
        }
        return acc;
    }, []);


  if (uniqueBreadcrumbItems.length <= 1) return null;

  return (
    <nav className="flex py-3" aria-label="Breadcrumb">
        <ol className="inline-flex items-center">
            {uniqueBreadcrumbItems.map((item, index) => {
            const isLast = index === uniqueBreadcrumbItems.length - 1;

            return (
                <li key={index} className="inline-flex items-center">
                    {index > 0 && (
                        <i className="bi bi-chevron-right text-gray-400 mx-2 text-xs"></i>
                    )}
                    
                    {isLast ? (
                        <span 
                            className="text-sm font-medium text-gray-500 truncate max-w-[150px] sm:max-w-xs"
                            aria-current="page"
                        >
                            {item.icon && <span className="mr-2 text-gray-500">{item.icon}</span>}
                            {item.label}
                        </span>
                    ) : (
                        <Link 
                            to={item.href || '#'} 
                            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            {item.icon && <span className="mr-2 text-gray-500">{item.icon}</span>}
                            {item.label}
                        </Link>
                    )}
                </li>
            );
            })}
        </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  // Items prop'u artık kullanılmıyor, bu yüzden kaldırıyoruz.
};

export default Breadcrumb; 
