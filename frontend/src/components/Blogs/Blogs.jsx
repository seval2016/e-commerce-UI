import BlogItem from "./BlogItem";
import { useData } from "../../context/DataContext.jsx";
import SectionTitle from "../common/SectionTitle";

const Blogs = () => {
  const { blogs, loading } = useData();
  
  // Admin panelde isPublished field'ı kullanılıyor, bu yüzden iki durumu da kontrol edelim
  const publishedBlogs = blogs
    .filter(blog => blog.status === 'published' || blog.isPublished === true)
    .sort((a, b) => {
      // En son eklenen önce gelsin (createdAt veya publishedAt'e göre sırala)
      const dateA = new Date(a.publishedAt || a.createdAt || 0);
      const dateB = new Date(b.publishedAt || b.createdAt || 0);
      return dateB - dateA; // Descending order (en yeni önce)
    })
    .slice(0, 4); // Sadece ilk 4 blog'u al

  // Loading durumunda spinner göster
  if (loading.blogs) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionTitle 
            title="From Our Blog"
            subtitle="Summer Collection New Modern Design"
          />
          
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Bloglar yükleniyor...</p>
          </div>
        </div>
      </section>
    );
  }

  // Blog yoksa boş durum göster
  if (publishedBlogs.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionTitle 
            title="From Our Blog"
            subtitle="Summer Collection New Modern Design"
          />
          
          <div className="text-center py-12">
            <div className="text-4xl text-gray-400 mb-4">
              <i className="bi bi-journal-text"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Henüz blog yazısı yok</h3>
            <p className="text-gray-500">Yakında yeni blog yazıları paylaşılacak</p>
          </div>
        </div>
      </section>
    );
  }

  // Blog verilerini göster
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionTitle 
          title="From Our Blog"
          subtitle="Summer Collection New Modern Design"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {publishedBlogs.map((blog) => (
            <BlogItem key={blog._id || blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
}
  

export default Blogs;
