import "./Testimonials.css";

const testimonials = [
  {
    name: "Ramsharan Duwadi",
    role: "Principal, Narayani Model Secondary School",
    content: "This system has revolutionized how we manage our school. The efficiency gains are remarkable, and our staff loves how user-friendly it is.",
    avatar: "👩‍💼"
  },
  {
    name: "Deepak Tiwari",
    role: "IT Administrator",
    content: "The best investment we've made. Integration was seamless, and the support team is incredibly responsive. Highly recommended!",
    avatar: "👨‍💻"
  },
  {
    name: "Bheglal Baral",
    role: "Teacher, Mathematics Department",
    content: "Grading and attendance tracking has never been easier. I can focus more on teaching and less on paperwork. Amazing system!",
    avatar: "👩‍🏫"
  }
];

function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2>What Our Users Say</h2>
          <p>Trusted by educators and administrators worldwide</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-content">
                <p>"{testimonial.content}"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.avatar}</div>
                <div className="author-info">
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-role">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;

