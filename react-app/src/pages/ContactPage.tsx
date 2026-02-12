import './ContactPage.css';

export function ContactPage() {
  return (
    <div className="contact-page">
      <div className="container">
        <h1>Get in Touch</h1>
        <p className="subtitle">Have questions? We'd love to hear from you!</p>

        <div className="contact-grid">
          <div className="contact-card">
            <div className="icon"></div>
            <h3>Email</h3>
            <p>Send us an email and we'll respond as soon as possible</p>
            <a href="mailto:info@noticeboard.local">info@noticeboard.local</a>
          </div>

          <div className="contact-card">
            <div className="icon"></div>
            <h3>Phone</h3>
            <p>Call us during business hours</p>
            <a href="tel:+254700000000">+254 700 000 000</a>
          </div>

          <div className="contact-card">
            <div className="icon"></div>
            <h3>WhatsApp</h3>
            <p>Chat with us on WhatsApp for quick responses</p>
            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noopener noreferrer"
            >
              +254 700 000 000
            </a>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" required placeholder="Your name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" required placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                required
                placeholder="Tell us how we can help..."
                rows={5}
              />
            </div>
            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-item">
            <h3>How do I post an ad?</h3>
            <p>Simply click on "Submit Post" in the navigation menu and fill out the form with your details. Your post will be reviewed by our admin team before appearing on the site.</p>
          </div>
          <div className="faq-item">
            <h3>How long do posts appear?</h3>
            <p>Posts remain active for 30 days. You can repost your ad after this period if needed.</p>
          </div>
          <div className="faq-item">
            <h3>Is there a cost to post?</h3>
            <p>Basic posts are free! We offer premium featured posts for better visibility.</p>
          </div>
          <div className="faq-item">
            <h3>How can I contact a poster?</h3>
            <p>Click on any post to view the contact details. You can call, email, or message them via WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
