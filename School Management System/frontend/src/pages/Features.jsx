import "./Features.css";

const features = [
  {
    icon: "👨‍🎓",
    title: "Student Management",
    description: "Comprehensive student profiles, enrollment tracking, and academic records all in one place. Manage student information, track academic progress, and maintain detailed records throughout their educational journey."
  },
  {
    icon: "👨‍🏫",
    title: "Teacher Portal",
    description: "Manage classes, assignments, grades, and communicate with students and parents efficiently. Access powerful tools for lesson planning, grading, attendance tracking, and student progress monitoring."
  },
  {
    icon: "📅",
    title: "Attendance Tracking",
    description: "Automated attendance system with real-time monitoring and detailed reports. Track daily attendance, generate reports for parents and administrators, and identify patterns to improve student engagement."
  },
  {
    icon: "📊",
    title: "Grade Management",
    description: "Streamlined grading system with automated calculations and progress tracking. Enter grades efficiently, calculate GPAs automatically, and generate comprehensive grade reports for students and parents."
  },
  {
    icon: "📚",
    title: "Library Management",
    description: "Digital library system for book tracking, borrowing, and inventory management. Manage library resources, track book loans, monitor returns, and maintain a comprehensive catalog of available materials."
  },
  {
    icon: "💳",
    title: "Online Payments",
    description: "Secure payment gateway for fees, library fines, and other school transactions. Process payments online securely, track payment history, and generate receipts automatically for all transactions."
  },
  {
    icon: "📱",
    title: "Mobile Access",
    description: "Access all features on-the-go with our responsive mobile-friendly interface. Students, teachers, and administrators can access the system from any device, anywhere, at any time."
  },
  {
    icon: "📈",
    title: "Analytics & Reports",
    description: "Comprehensive analytics dashboard with detailed reports and insights. Generate attendance reports, academic performance analytics, financial reports, and custom reports to make data-driven decisions."
  },
  {
    icon: "🔔",
    title: "Notifications & Communication",
    description: "Real-time notifications and communication system for students, parents, and staff. Send announcements, alerts, reminders, and maintain seamless communication channels across the school community."
  },
  {
    icon: "📝",
    title: "Assignment Management",
    description: "Create, distribute, and manage assignments efficiently. Teachers can upload assignments, set deadlines, and students can submit work online. Track submissions and provide timely feedback."
  },
  {
    icon: "⏰",
    title: "Timetable & Scheduling",
    description: "Automated timetable generation and class scheduling system. Create optimized schedules, manage room allocations, and handle timetable conflicts automatically to ensure smooth operations."
  },
  {
    icon: "👥",
    title: "Parent Portal",
    description: "Dedicated portal for parents to track their child's progress, view attendance, grades, assignments, and communicate with teachers. Stay connected with your child's education journey."
  }
];

function Features() {
  return (
    <div className="features-page">
      <div className="features-container">
        <div className="features-header">
          <h1>Powerful Features for Modern Schools</h1>
          <p className="features-subtitle">
            Everything you need to manage your school efficiently and effectively
          </p>
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
    </div>
  );
}

export default Features;

