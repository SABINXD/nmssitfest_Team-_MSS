import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="logo">
        <img src="/logo.png" alt="NMSS SMART logo" />
        <span className="brand">NMSS SMART</span>
      </div>

      <input id="nav-toggle" className="nav-toggle" type="checkbox" aria-hidden="true" />
      <label className="nav-toggle-label" htmlFor="nav-toggle" aria-label="Open menu">
        <span></span>
      </label>

      <div className="nav-menu">
        <ul className="nav-links">
          <li><NavLink to="/" end className={({ isActive }) => (isActive ? "active" : undefined)}>🏠 Home</NavLink></li>
          <li><NavLink to="/features" className={({ isActive }) => (isActive ? "active" : undefined)}>⭐ Features</NavLink></li>
          
          {/* Only show these if logged in */}
          {isAuthenticated() && user?.role === 'student' && (
            <li><NavLink to="/student" className={({ isActive }) => (isActive ? "active" : undefined)}>👨‍🎓Student</NavLink></li>
          )}
          
          {isAuthenticated() && user?.role === 'teacher' && (
            <li><NavLink to="/teacher" className={({ isActive }) => (isActive ? "active" : undefined)}>👨‍🏫 Teacher</NavLink></li>
          )}
          
          {isAuthenticated() && user?.role === 'admin' && (
            <li><NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : undefined)}>⚙️ Admin Panel</NavLink></li>
          )}
          
          {/* Public routes */}
          <li><NavLink to="/generate-timetable" className={({ isActive }) => (isActive ? "active" : undefined)}>📅Timetable</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => (isActive ? "active" : undefined)}>ℹ️ About</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : undefined)}>📞 Contact</NavLink></li>
        </ul>

        {/* Auth Section */}
        <div className="nav-auth">
          {isAuthenticated() ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-avatar">{user.avatar}</span>
                <span className="user-name">{user.name}</span>
                <span className="user-role">({user.role})</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                🔓 Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="login-btn">
              🔑 Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;