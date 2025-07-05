import Reviews from "../Reviews/Reviews";
import Badge from "../common/Badge";

const BlogDetails = () => {
  return (
    <section className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Blog Header */}
        <article className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Featured Image */}
          <figure className="relative">
            <img 
              src="/img/blogs/blog1.jpg" 
              alt="Blog Post" 
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute top-6 left-6">
              <Badge variant="primary" size="lg">
                COLLECTION
              </Badge>
            </div>
          </figure>

          {/* Blog Content */}
          <div className="p-8">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <i className="bi bi-calendar3 text-gray-400"></i>
                <span>April 25, 2022</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="bi bi-chat-dots text-gray-400"></i>
                <span>0 Comments</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="bi bi-tags text-gray-400"></i>
                <div className="flex gap-2">
                  <a href="#" className="hover:text-blue-600 transition-colors">products</a>
                  <span>,</span>
                  <a href="#" className="hover:text-blue-600 transition-colors">coats</a>
                </div>
              </div>
            </div>

            {/* Blog Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
              The Best Products That Shape Fashion
            </h1>

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Donec rhoncus quis diam sit amet faucibus. Vivamus pellentesque,
                sem sed convallis ultricies, ante eros laoreet libero, vitae
                suscipit lorem turpis sit amet lectus. Quisque egestas lorem ut
                mauris ultrices, vitae sollicitudin quam facilisis. Vivamus
                rutrum urna non ligula tempor aliquet. Fusce tincidunt est
                magna, id malesuada massa imperdiet ut. Nunc non nisi urna. Nam
                consequat est nec turpis eleifend ornare. Vestibulum eu justo
                lobortis mauris commodo efficitur. Nunc pulvinar pulvinar
                cursus.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                Nulla id nibh ligula. Etiam finibus elit nec nisl faucibus, vel
                auctor tortor iaculis. Vivamus aliquet ipsum purus, vel auctor
                felis interdum at. Praesent quis fringilla justo. Ut non dui at
                mi laoreet gravida vitae eu elit. Aliquam in elit eget purus
                scelerisque efficitur vel ac sem. Etiam ante magna, vehicula et
                vulputate in, aliquam sit amet metus. Donec mauris eros, aliquet
                in nibh quis, semper suscipit nunc. Phasellus ornare nibh vitae
                dapibus tempor.
              </p>

              {/* Quote Block */}
              <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-8 bg-blue-50 rounded-r-lg">
                <p className="text-lg italic text-gray-800 font-medium">
                  "Aliquam purus enim, fringilla vel nunc imperdiet, consequat
                  ultricies massa. Praesent sed turpis sollicitudin, dignissim
                  justo vel, fringilla mi."
                </p>
              </blockquote>

              <p className="text-gray-700 leading-relaxed mb-6">
                Vivamus libero leo, tincidunt eget lectus rhoncus, finibus
                interdum neque. Curabitur aliquet dolor purus, id molestie purus
                elementum vitae. Sed quis aliquet eros. Morbi condimentum ornare
                nibh, et tincidunt ante interdum facilisis. Praesent sagittis
                tortor et felis finibus vestibulum. Interdum et malesuada fames
                ac ante ipsum primis in faucibus. Vivamus dapibus turpis sit
                amet turpis tincidunt, sit amet mollis turpis suscipit. Proin
                arcu diam, pretium nec tempus eu, feugiat non ex.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                Nulla id nibh ligula. Etiam finibus elit nec nisl faucibus, vel
                auctor tortor iaculis. Vivamus aliquet ipsum purus, vel auctor
                felis interdum at. Praesent quis fringilla justo. Ut non dui at
                mi laoreet gravida vitae eu elit. Aliquam in elit eget purus
                scelerisque efficitur vel ac sem. Etiam ante magna, vehicula et
                vulputate in, aliquam sit amet metus. Donec mauris eros, aliquet
                in nibh quis, semper suscipit nunc. Phasellus ornare nibh vitae
                dapibus tempor.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                Donec feugiat tincidunt eros, ac aliquam purus egestas
                condimentum. Curabitur imperdiet at leo pellentesque mattis.
                Fusce a dignissim est. In enim nisi, hendrerit placerat nunc
                quis, porttitor lobortis neque. Donec nec nulla arcu. Proin
                felis augue, volutpat ac nunc a, semper egestas dolor. Sed
                varius magna non lacus viverra, at dapibus sem interdum. Proin
                urna nibh, maximus nec interdum ut, hendrerit et arcu. Nunc
                venenatis eget nulla at tempor. Duis sed tellus placerat,
                bibendum felis quis, efficitur nisi. Morbi porta placerat urna
                et pharetra. Proin condimentum, libero ac feugiat efficitur, est
                orci consectetur sapien, a pretium leo leo in elit. Quisque
                fringilla finibus arcu, pretium posuere urna posuere sit amet.
                Nullam quis sapien a augue aliquet accumsan eget eu risus. Ut at
                mi sed velit condimentum porta. Proin vestibulum congue
                ullamcorper.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Nunc blandit ligula mi, quis commodo dolor fermentum sit amet.
                Nam vehicula pharetra lacus a vulputate. Duis pulvinar
                vestibulum dolor, vel commodo arcu laoreet ac. Vestibulum sed
                consequat purus, vitae auctor metus. Duis ut aliquet odio, at
                tincidunt nunc. Vestibulum dignissim aliquet orci, rutrum
                malesuada ipsum facilisis vel. Morbi tempor dignissim nisi.
                Maecenas scelerisque maximus justo eget sodales. Sed finibus
                consectetur vulputate. Pellentesque id pellentesque nulla. Sed
                ut viverra eros. Vestibulum ut ligula quam.
              </p>
            </div>

            {/* Author Info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <i className="bi bi-person text-2xl text-gray-500"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">John Doe</h3>
                  <p className="text-sm text-gray-600">Fashion Blogger & Designer</p>
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