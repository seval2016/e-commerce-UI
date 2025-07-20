import Blogs from "../components/Blogs/Blogs";
import Breadcrumb from "../components/common/Breadcrumb";
import SectionTitle from "../components/common/SectionTitle";

const BlogPage = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <Breadcrumb />
        <div className="mt-8">
            <Blogs showTitle={false}/>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
