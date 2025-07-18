import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Alert from "../common/Alert";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setAlert({
        type: 'success',
        title: 'Mesaj gönderildi!',
        message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
        autoClose: true,
        autoCloseDelay: 5000
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section>
      <div>
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.9633698339308!2d28.929441087738052!3d41.04793012296828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab1d021adf417%3A0xba3a3fdfdbb5f5d!2sEy%C3%BCp%20Sultan%20Camii!5e0!3m2!1str!2str!4v1665091191675!5m2!1str!2str"
            width="100%"
            height="500"
            style={{
              border: "0",
            }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <div className="my-8">
        <div className="container">
          <div className="w-3/4 md:w-full">
            <h4 className="text-red-600 font-medium">Contact with us</h4>
            <h2 className="text-4xl font-semibold">Get In Touch</h2>
            <p className="text-sm">
              In hac habitasse platea dictumst. Pellentesque viverra sem nec
              orci lacinia, in bibendum urna mollis. Quisque nunc lacus, varius
              vel leo a, pretium lobortis metus. Vivamus consectetur consequat
              justo.
            </p>
          </div>
          <div className="flex justify-between mt-12 gap-24 md:flex-col md:gap-12">
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-5 md:flex-col">
              {alert && (
                <div className="w-full mb-4">
                  <Alert {...alert} onClose={() => setAlert(null)} />
                </div>
              )}
              <div className="flex-[calc(50%-10px)] md:flex-none">
                <Input
                  type="text"
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  size="md"
                  fullWidth
                />
              </div>
              <div className="flex-[calc(50%-10px)] md:flex-none">
                <Input
                  type="email"
                  label="Your email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  size="md"
                  fullWidth
                />
              </div>
              <div className="flex-[100%]">
                <Input
                  type="text"
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  size="md"
                  fullWidth
                />
              </div>
              <div className="flex-[100%]">
                <Input
                  type="textarea"
                  label="Your message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  size="md"
                  fullWidth
                  rows={5}
                />
              </div>
              <Button variant="primary" size="sm" loading={loading} type="submit">
                {loading ? 'Gönderiliyor...' : 'Send Message'}
              </Button>
            </form>
            <div className="flex-[50%] flex flex-col gap-5">
              <div className="text-sm">
                <div className="flex flex-col">
                  <strong> Clotya Store</strong>
                  <p className="my-4">
                    Clotya Store Germany — 785 15h Street, Office 478/B Green
                    Mall Berlin, De 81566
                  </p>
                  <a href="tel:Phone: +1 1234 567 88" className="block">Phone: +1 1234 567 88</a>
                  <a href="mailto:Email: contact@example.com" className="block">
                    Email: contact@example.com
                  </a>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex flex-col">
                  <strong> Opening Hours</strong>
                  <p className="mt-2.5">Monday - Friday : 9am - 5pm</p>
                  <p>Weekend Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
