import "./Benefits.css";

const benefits = [
  {
    title: "Save Time & Resources",
    description: "Automate routine tasks and reduce administrative workload by up to 70%.",
    icon: "⏱️"
  },
  {
    title: "Enhanced Communication",
    description: "Seamless communication between teachers, students, and parents through integrated messaging.",
    icon: "💬"
  },
  {
    title: "Data Security",
    description: "Enterprise-grade security with encrypted data storage and regular backups.",
    icon: "🔒"
  }
];

function Benefits() {
  return (
    <section className="benefits-section">
      <div className="container">
        <div className="section-header">
          <h2>Why Choose Our System?</h2>
          <p>Experience the difference with our comprehensive school management solution</p>
        </div>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Benefits;

