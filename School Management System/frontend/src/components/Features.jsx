import "./Features.css";

const features = [
  {
    icon: "👨‍🎓",
    title: "Student Management",
    description: "Comprehensive student profiles, enrollment tracking, and academic records all in one place."
  },
  {
    icon: "👨‍🏫",
    title: "Teacher Portal",
    description: "Manage classes, assignments, grades, and communicate with students and parents efficiently."
  },
  {
    icon: "📅",
    title: "Attendance Tracking",
    description: "Automated attendance system with real-time monitoring and detailed reports."
  },
  {
    icon: "📊",
    title: "Grade Management",
    description: "Streamlined grading system with automated calculations and progress tracking."
  },
  {
    icon: "📚",
    title: "Library Management",
    description: "Digital library system for book tracking, borrowing, and inventory management."
  },
  {
    icon: "💳",
    title: "Online Payments",
    description: "Secure payment gateway for fees, library fines, and other school transactions."
  },
  {
    icon: "📱",
    title: "Mobile Access",
    description: "Access all features on-the-go with our responsive mobile-friendly interface."
  },
  {
    icon: "📈",
    title: "Analytics & Reports",
    description: "Comprehensive analytics dashboard with detailed reports and insights."
  }
];

function Features() {
  return (
    <section className="features-section">
      <div className="container">
        <div className="section-header">
          <h2>Powerful Features for Modern Schools</h2>
          <p>Everything you need to manage your school efficiently and effectively</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;

