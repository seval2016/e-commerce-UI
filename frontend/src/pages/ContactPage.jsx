import Contact from "../components/Contact/Contact";
import Breadcrumb from "../components/common/Breadcrumb";

const ContactPage = () => {
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <Breadcrumb />
        <Contact />
      </div>
    </div>
  );
};

export default ContactPage;
