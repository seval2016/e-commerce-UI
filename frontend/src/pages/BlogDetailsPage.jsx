import BlogDetails from '../components/BlogDetails/BlogDetails'
import Breadcrumb from '../components/common/Breadcrumb';

const BlogDetailsPage = () => {
  return (
    <div className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
            <Breadcrumb />
            <div className="mt-8">
                <BlogDetails />
            </div>
        </div>
    </div>
  )
}

export default BlogDetailsPage
