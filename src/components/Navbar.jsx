import { NavLink } from "react-router-dom";

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
      : "text-gray-600 hover:text-blue-600 transition";

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 tracking-wide">HRMS Lite</h1>
        <div className="flex gap-8">
          <NavLink to="/" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/employees" className={linkClass}>Employees</NavLink>
          <NavLink to="/attendance" className={linkClass}>Attendance</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
