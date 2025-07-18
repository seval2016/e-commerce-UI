import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import Card from "../common/Card";

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

const BlogItem = ({ blog }) => {
  return (
    <Card className="overflow-hidden group h-full" padding="p-0">
      {/* Blog Image */}
      <Link to={`/blog/${blog.slug}`} className="block relative overflow-hidden">
        <img 
          src={getBlogImageUrl(blog.image)} 
          alt={blog.title} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="primary" size="lg">
            {blog.category}
          </Badge>
        </div>
      </Link>

      {/* Blog Content */}
      <div className="p-6 flex flex-col h-full">
        {/* Meta Information */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <i className="bi bi-calendar3 text-gray-400"></i>
            <span>{blog.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <i className="bi bi-chat-dots text-gray-400"></i>
            <span>{blog.comments || 0} Comments</span>
          </div>
        </div>

        {/* Title and Content Area - Fixed Height */}
        <div className="flex-grow h-32">
          {/* Blog Title */}
          <Link to={`/blog/${blog.slug}`} className="block mb-4">
            <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {blog.title}
            </h3>
          </Link>

          {/* Blog Excerpt */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {blog.excerpt}
          </p>
        </div>

        {/* Read More Link */}
        <Link 
          to={`/blog/${blog.slug}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors duration-200 mt-4"
        >
          Read More
          <i className="bi bi-arrow-right text-xs"></i>
        </Link>
      </div>
    </Card>
  );
};

export default BlogItem;
