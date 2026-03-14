import { NavLink } from "react-router-dom";

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "nav-link active"
      : "nav-link";

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <div className="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="3" width="9" height="9" rx="2" fill="#64FFDA"/>
              <rect x="13" y="3" width="9" height="9" rx="2" fill="#64FFDA" opacity="0.5"/>
              <rect x="2" y="14" width="9" height="9" rx="2" fill="#64FFDA" opacity="0.5"/>
              <rect x="13" y="14" width="9" height="9" rx="2" fill="#64FFDA" opacity="0.3"/>
            </svg>
          </div>
          <span className="brand-text">HRMS <span className="brand-accent">Lite</span></span>
        </div>
        <div className="nav-links">
          <NavLink to="/" className={linkClass}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </NavLink>
          <NavLink to="/employees" className={linkClass}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Employees
          </NavLink>
          <NavLink to="/attendance" className={linkClass}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Attendance
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;