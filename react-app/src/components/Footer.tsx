import './Footer.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Your local digital noticeboard for jobs, rentals, events, and more.</p>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: info@noticeboard.local</p>
          <p>Phone: +254 700 000 000</p>
          <p>WhatsApp: +254 700 000 000</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/submit">Submit Post</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} Local Digital Noticeboard. All rights reserved.</p>
      </div>
    </footer>
  );
}
