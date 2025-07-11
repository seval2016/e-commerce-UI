import BlogItem from "./BlogItem";
import { useData } from "../../context/DataContext.jsx";
import SectionTitle from "../common/SectionTitle";

const Blogs = () => {
  const { blogs } = useData();
  const publishedBlogs = blogs.filter(blog => blog.status === 'published');

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <SectionTitle 
          title="From Our Blog"
          subtitle="Summer Collection New Modern Design"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {publishedBlogs.map((blog) => (
            <BlogItem key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;