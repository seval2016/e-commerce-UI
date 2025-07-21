import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import Reviews from "../Reviews/Reviews";
import Badge from "../common/Badge";
import { useData } from "../../context/DataContext.jsx";
import api from "../../services/api.js"; // Import api service

// Backend API taban URL'si
const API_BASE_URL = "http://localhost:5000";

// Blog görsel yolunu backend ile birleştir
const getBlogImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("/uploads/")) {
    return API_BASE_URL + imagePath;
  }
  return imagePath;
};

const BlogDetails = () => {
  const { slug } = useParams();
  const { blogs } = useData();

  // Tüm hook'ları bileşenin en üstüne taşı
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Blog bulma mantığını useMemo ile optimize et
  const blog = useMemo(() => {
    if (!blogs || !slug) return null;
    
    let foundBlog = blogs.find(b => b.slug === slug);
    if (foundBlog) return foundBlog;

    foundBlog = blogs.find(b => b._id === slug || b.id === slug);
    if (foundBlog) return foundBlog;
    
    return blogs.find(b => {
      const generatedSlug = b.title?.toLowerCase()
        .replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
      return generatedSlug === slug;
    });
  }, [blogs, slug]);

  // Sayfayı üste kaydırma efekti
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [slug]);

  // Blog verisi bulunduğunda state'leri ayarla
  useEffect(() => {
    if (blog) {
      setLikeCount(blog.likes || 0);
      const likedBlogs = JSON.parse(localStorage.getItem('likedBlogs') || '[]');
      if (likedBlogs.includes(blog._id)) {
        setIsLiked(true);
      } else {
        setIsLiked(false); // Başka bir bloga geçildiğinde durumu sıfırla
      }
    }
  }, [blog]);

  const handleLike = async () => {
    if (isLiked || !blog) {
      return;
    }

    try {
      const response = await api.likeBlog(blog._id);
      if (response.success) {
        setLikeCount(response.likes);
        setIsLiked(true);
        const likedBlogs = JSON.parse(localStorage.getItem('likedBlogs') || '[]');
        localStorage.setItem('likedBlogs', JSON.stringify([...likedBlogs, blog._id]));
      }
    } catch (error) {
      console.error("Failed to like the blog:", error);
    }
  };
  
  // Koşullu render (return) hook'lardan sonra gelir
  if (!blog) {
    return (
      <section className="py-12 bg-white min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog bulunamadı</h1>
            <p className="text-gray-600">Aradığınız blog yazısı mevcut değil.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Blog Header */}
        <article className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Featured Image */}
          <figure className="relative">
            {(() => {
              const blogImagePath = blog.featuredImage || blog.image || blog.img || null;
              const blogImageUrl = getBlogImageUrl(blogImagePath);
              
              return blogImageUrl ? (
                <img 
                  src={blogImageUrl}
                  alt={blog.title} 
                  className="w-full h-56 sm:h-64 md:h-80 lg:h-96 object-cover"
                  onError={(e) => {
                    e.target.src = '/img/blogs/blog1.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <i className="bi bi-image text-5xl mb-3"></i>
                    <p>Blog Resmi Yok</p>
                  </div>
                </div>
              );
            })()}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
              <Badge variant="primary" size="lg">
                {blog.category?.name || blog.category || 'Kategori'}
              </Badge>
            </div>
          </figure>

          {/* Blog Content */}
          <div className="p-6 sm:p-8">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <i className="bi bi-calendar3 text-gray-400"></i>
                <span>{new Date(blog.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="bi bi-chat-dots text-gray-400"></i>
                <span>{blog.reviews?.filter(r => r.isApproved).length || 0} Comments</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="bi bi-eye text-gray-400"></i>
                <span>{blog.views || 0} Views</span>
              </div>
              <div
                className={`flex items-center gap-2 cursor-pointer ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
                onClick={handleLike}
              >
                <i className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                <span>{likeCount} Likes</span>
              </div>
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <i className="bi bi-tags text-gray-400"></i>
                  <div className="flex gap-2">
                    {blog.tags.map((tag, index) => (
                      <span key={index}>
                        <a href="#" className="hover:text-blue-600 transition-colors">
                          {tag?.name || tag}
                        </a>
                        {index < blog.tags.length - 1 && <span>,</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Blog Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
              {blog.title}
            </h1>

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }}>
            </div>

            {/* Author Info */}
            <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                {blog.author?.avatar || blog.authorImage ? (
                  <img
                    src={blog.author?.avatar || blog.authorImage}
                    alt={blog.author?.name || blog.author || 'Yazar'}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover bg-gray-200 border"
                    onError={e => { e.target.src = '/img/avatar-default.png'; }}
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <i className="bi bi-person text-2xl text-gray-500"></i>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{blog.author?.name || blog.author || 'Anonim'}</h3>
                  <p className="text-sm text-gray-600">Blog Yazarı</p>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-10 sm:mt-12">
          <Reviews blog={blog}/>
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;
