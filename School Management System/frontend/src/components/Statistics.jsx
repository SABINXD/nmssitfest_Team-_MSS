import "./Statistics.css";

const stats = [
  { number: "4K+", label: "Active Students" },
  { number: "200+", label: "Teachers" },
  { number: "50+", label: "Staffs" },
];

function Statistics() {
  return (
    <section className="statistics-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Statistics;

