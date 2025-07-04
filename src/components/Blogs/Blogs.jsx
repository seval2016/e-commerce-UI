import BlogItem from "./BlogItem";

const Blogs = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">From Our Blog</h2>
          <p className="text-lg text-gray-600">Summer Collection New Modern Design</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BlogItem />
          <BlogItem />
          <BlogItem />
        </div>
      </div>
    </section>
  );
};

export default Blogs;