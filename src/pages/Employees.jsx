import { useEffect, useState } from "react";
import api from "../api/axios";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });
  const [deletingId, setDeletingId] = useState(null);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees/");
      setEmployees(res.data);
    } catch {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await api.post("/employees/", form);
      setForm({ employee_id: "", full_name: "", email: "", department: "" });
      setSuccess("Employee added successfully!");
      fetchEmployees();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err.response?.data) {
        setError(Object.values(err.response.data).flat().join(", "));
      } else {
        setError("Failed to create employee");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/employees/${id}/`);
      fetchEmployees();
    } catch {
      alert("Failed to delete employee");
    } finally {
      setDeletingId(null);
    }
  };

  const deptColors = {
    Engineering: "#64FFDA",
    Marketing: "#FFD580",
    Sales: "#82B4FF",
    HR: "#FF8FA3",
    Finance: "#B8FF7C",
    Operations: "#FFB86C",
  };

  const getDeptColor = (dept) =>
    deptColors[dept] || "#CCD6F6";

  const getInitials = (name) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="page-wrapper fade-in">
      <div className="page-header">
        <div>
          <h2 className="page-title">Employee Management</h2>
          <p className="page-subtitle">{employees.length} employees registered</p>
        </div>
        <div className="badge-count">{employees.length}</div>
      </div>

      {/* Add Employee Form */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add New Employee
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field-group">
            <label className="field-label">Employee ID</label>
            <input
              name="employee_id"
              value={form.employee_id}
              onChange={handleChange}
              placeholder="e.g. EMP001"
              className="field-input"
              required
            />
          </div>
          <div className="field-group">
            <label className="field-label">Full Name</label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="e.g. John Smith"
              className="field-input"
              required
            />
          </div>
          <div className="field-group">
            <label className="field-label">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@company.com"
              className="field-input"
              required
            />
          </div>
          <div className="field-group">
            <label className="field-label">Department</label>
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="e.g. Engineering"
              className="field-input"
              required
            />
          </div>
          <button type="submit" className="submit-btn full-width">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Employee
          </button>
        </form>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
      </div>

      {/* Employee List */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            Employee Directory
          </h3>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading employees...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            <p>No employees found. Add your first employee above.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="table-row">
                    <td>
                      <div className="employee-cell">
                        <div
                          className="avatar"
                          style={{ background: getDeptColor(emp.department) + "22", color: getDeptColor(emp.department) }}
                        >
                          {getInitials(emp.full_name)}
                        </div>
                        <span className="emp-name">{emp.full_name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="id-badge">{emp.employee_id}</span>
                    </td>
                    <td className="text-muted">{emp.email}</td>
                    <td>
                      <span
                        className="dept-tag"
                        style={{
                          color: getDeptColor(emp.department),
                          background: getDeptColor(emp.department) + "18",
                          borderColor: getDeptColor(emp.department) + "40",
                        }}
                      >
                        {emp.department}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="delete-btn"
                        disabled={deletingId === emp.id}
                      >
                        {deletingId === emp.id ? (
                          "Deleting..."
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14H6L5 6"/>
                              <path d="M10 11v6M14 11v6"/>
                              <path d="M9 6V4h6v2"/>
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
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

export default Employees;