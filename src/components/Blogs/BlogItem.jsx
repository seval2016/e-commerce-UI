import { Link } from "react-router-dom";

const BlogItem = ({ blog }) => {
  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Blog Image */}
      <Link to={`/blog/${blog.slug}`} className="block relative overflow-hidden">
        <img 
          src={blog.image} 
          alt={blog.title} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {blog.category}
          </span>
        </div>
      </Link>

      {/* Blog Content */}
      <div className="p-6">
        {/* Meta Information */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <i className="bi bi-calendar3 text-gray-400"></i>
            <span>{blog.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <i className="bi bi-chat-dots text-gray-400"></i>
            <span>{blog.comments} Comments</span>
          </div>
        </div>

        {/* Blog Title */}
        <Link to={`/blog/${blog.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {blog.title}
          </h3>
        </Link>

        {/* Blog Excerpt */}
        <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
          {blog.excerpt}
        </p>

        {/* Read More Link */}
        <Link 
          to={`/blog/${blog.slug}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
        >
          Read More
          <i className="bi bi-arrow-right text-sm"></i>
        </Link>
      </div>
    </article>
  );
};

export default BlogItem;