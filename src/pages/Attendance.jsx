import { useEffect, useState } from "react";
import api from "../api/axios";

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    employee_id: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });
  const [filters, setFilters] = useState({
    employee_id: "",
    date: "",
  });

  const fetchEmployees = async () => {
    const res = await api.get("/employees/");
    setEmployees(res.data);
  };

  const fetchAttendance = async (params = {}) => {
    try {
      const res = await api.get("/attendance/list/", { params });
      setRecords(res.data);
    } catch {
      setError("Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
    fetchAttendance(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await api.post("/attendance/", form);
      setSuccess("Attendance marked successfully!");
      setForm({ employee_id: "", date: new Date().toISOString().split("T")[0], status: "Present" });
      fetchAttendance(filters);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err.response?.data) {
        setError(Object.values(err.response.data).flat().join(", "));
      } else {
        setError("Failed to mark attendance");
      }
    }
  };

  const presentCount = records.filter((r) => r.status === "Present").length;
  const absentCount = records.filter((r) => r.status === "Absent").length;

  return (
    <div className="page-wrapper fade-in">
      <div className="page-header">
        <div>
          <h2 className="page-title">Attendance Management</h2>
          <p className="page-subtitle">Track and manage employee attendance records</p>
        </div>
        <div className="attendance-stats-mini">
          <span className="mini-stat present">{presentCount} Present</span>
          <span className="mini-stat absent">{absentCount} Absent</span>
        </div>
      </div>

      {/* Mark Attendance */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Mark Attendance
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field-group">
            <label className="field-label">Select Employee</label>
            <select
              name="employee_id"
              value={form.employee_id}
              onChange={handleChange}
              className="field-input"
              required
            >
              <option value="">— Select Employee —</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employee_id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>
          <div className="field-group">
            <label className="field-label">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="field-input"
              required
            />
          </div>
          <div className="field-group">
            <label className="field-label">Status</label>
            <div className="status-toggle">
              <button
                type="button"
                className={`toggle-btn ${form.status === "Present" ? "active-present" : ""}`}
                onClick={() => setForm({ ...form, status: "Present" })}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Present
              </button>
              <button
                type="button"
                className={`toggle-btn ${form.status === "Absent" ? "active-absent" : ""}`}
                onClick={() => setForm({ ...form, status: "Absent" })}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Absent
              </button>
            </div>
          </div>
          <button type="submit" className="submit-btn full-width">
            Save Attendance Record
          </button>
        </form>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
      </div>

      {/* Records */}
      <div className="card">
        <div className="card-header card-header-row">
          <h3 className="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            Attendance Records
          </h3>
          <div className="filter-row">
            <select
              name="employee_id"
              value={filters.employee_id}
              onChange={handleFilterChange}
              className="field-input filter-select"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.employee_id}>
                  {emp.full_name}
                </option>
              ))}
            </select>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="field-input filter-date"
            />
            {(filters.employee_id || filters.date) && (
              <button
                className="clear-btn"
                onClick={() => {
                  const cleared = { employee_id: "", date: "" };
                  setFilters(cleared);
                  fetchAttendance(cleared);
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading records...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <p>No attendance records found.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec.id} className="table-row">
                    <td>
                      <div className="employee-cell">
                        <div
                          className="avatar"
                          style={{
                            background: rec.status === "Present" ? "#64FFDA22" : "#FF8FA322",
                            color: rec.status === "Present" ? "#64FFDA" : "#FF8FA3",
                          }}
                        >
                          {rec.employee_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <span className="emp-name">{rec.employee_name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="date-cell">
                        {new Date(rec.date).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${rec.status === "Present" ? "badge-present" : "badge-absent"}`}>
                        {rec.status === "Present" ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        )}
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;