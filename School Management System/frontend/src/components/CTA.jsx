import { useNavigate } from "react-router-dom";
import "./CTA.css";

function CTA() {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2>Narayani Model Secondary School Management System</h2>
          <p>Comprehensive school management solution for Narayani Model Secondary School</p>
          <div className="cta-buttons">
            <button 
              className="cta-primary-btn" 
              onClick={() => navigate("/login")}
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;

