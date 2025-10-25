export default function Contact() {
  return (
    <section className="contact-page">
      {/* Header Section */}
      <div className="contact-header">
        <h1>Get in Touch</h1>
        <p>
          We’d love to hear from you! Whether it’s feedback, questions, or just saying hello.
        </p>
      </div>

      {/* Contact Container */}
      <div className="contact-container">
        {/* LEFT: Contact Form */}
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Your Name" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Your Email" required />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows={5} placeholder="Your Message..." required></textarea>
            </div>

            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>

        {/* RIGHT: Map Section */}
        <div className="contact-map">
          <iframe
            title="CoffeeBara Café Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.656306356014!2d121.1326625!3d14.2390443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd62671ec65f4b%3A0x372d23321dfb122f!2sCabuyao%20City%2C%204025%20Laguna!5e0!3m2!1sen!2sph!4v1729010000000!5m2!1sen!2sph"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
