import { useParams } from "react-router-dom";
import Reviews from "../Reviews/Reviews";
import Badge from "../common/Badge";
import { useData } from "../../context/DataContext.jsx";

// Backend API base URL
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
  const { id } = useParams();
  const { blogs } = useData();
  
  // Find blog by slug
  const blog = blogs.find(b => b.slug === id);

  
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
            <img 
              src={getBlogImageUrl(blog.image)} 
              alt={blog.title} 
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute top-6 left-6">
              <Badge variant="primary" size="lg">
                {blog.category}
              </Badge>
            </div>
          </figure>

          {/* Blog Content */}
          <div className="p-8">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <i className="bi bi-calendar3 text-gray-400"></i>
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="bi bi-chat-dots text-gray-400"></i>
                <span>{blog.comments} Comments</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="bi bi-eye text-gray-400"></i>
                <span>{blog.views || 0} Views</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="bi bi-heart text-gray-400"></i>
                <span>{blog.likes || 0} Likes</span>
              </div>
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <i className="bi bi-tags text-gray-400"></i>
                  <div className="flex gap-2">
                    {blog.tags.map((tag, index) => (
                      <span key={index}>
                        <a href="#" className="hover:text-blue-600 transition-colors">{tag}</a>
                        {index < blog.tags.length - 1 && <span>,</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Blog Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
              {blog.title}
            </h1>

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                {blog.content}
              </p>
            </div>

            {/* Author Info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <i className="bi bi-person text-2xl text-gray-500"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{blog.author}</h3>
                  <p className="text-sm text-gray-600">Blog Yazarı</p>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-12">
          <Reviews />
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;
