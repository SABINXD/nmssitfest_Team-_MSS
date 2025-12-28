import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p className="contact-subtitle">Get in touch with Narayani Model Secondary School</p>
        </div>

        <div className="contact-content">
          <div className="contact-info-section">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Address</h3>
              <p>Narayani Model Secondary School</p>
              <p>Nepal</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <p>info@narayanimodel.edu.np</p>
              <p>admin@narayanimodel.edu.np</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Phone</h3>
              <p>+977-XXX-XXXXXXX</p>
              <p>Office Hours: 9:00 AM - 5:00 PM</p>
            </div>

            <div className="info-card">
              <div className="info-icon">🕒</div>
              <h3>Office Hours</h3>
              <p>Sunday - Friday: 9:00 AM - 5:00 PM</p>
              <p>Saturday: Closed</p>
            </div>
          </div>

          <div className="contact-form-section">
            <div className="form-card">
              <h2>Send us a Message</h2>
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" placeholder="Enter your full name" />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" placeholder="Enter your email" />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" name="subject" placeholder="What is this regarding?" />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="6" placeholder="Type your message here..."></textarea>
                </div>

                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;

