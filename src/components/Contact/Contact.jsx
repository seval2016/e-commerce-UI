const Contact = () => {
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
            <form className="flex flex-wrap gap-5 md:flex-col">
              <div className="flex flex-col flex-[calc(50%-10px)] text-sm gap-1 md:flex-none">
                <label>
                  Your Name
                  <span className="text-red-600">*</span>
                </label>
                <input type="text" required className="px-4 py-2 border border-gray-300 rounded" />
              </div>
              <div className="flex flex-col flex-[calc(50%-10px)] text-sm gap-1 md:flex-none">
                <label>
                  Your email
                  <span className="text-red-600">*</span>
                </label>
                <input type="text" required className="px-4 py-2 border border-gray-300 rounded" />
              </div>
              <div className="flex flex-col flex-[100%] text-sm gap-1">
                <label>
                  Subject
                  <span className="text-red-600">*</span>
                </label>
                <input type="text" required className="px-4 py-2 border border-gray-300 rounded" />
              </div>
              <div className="flex flex-col flex-[100%] text-sm gap-1">
                <label>
                  Your message
                  <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="author"
                  name="author"
                  type="text"
                  defaultValue=""
                  size="30"
                  required=""
                  className="px-4 py-2 border border-gray-300 rounded resize-none"
                  rows="5"
                ></textarea>
              </div>
              <button className="btn btn-sm bg-black text-white">Send Message</button>
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