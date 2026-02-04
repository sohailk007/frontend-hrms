import { useEffect, useState } from "react";
import api from "../api/axios";

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    employee_id: "",
    date: "",
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

    try {
      await api.post("/attendance/", form);
      setForm({ employee_id: "", date: "", status: "Present" });
      fetchAttendance(filters);
    } catch (err) {
      if (err.response?.data) {
        setError(Object.values(err.response.data).flat().join(", "));
      } else {
        setError("Failed to mark attendance");
      }
    }
  };

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-semibold text-gray-900">Attendance Management</h2>

      {/* Mark Attendance */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Mark Attendance</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select name="employee_id" value={form.employee_id} onChange={handleChange} className="border p-2 rounded-lg" required>
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.employee_id}>
                {emp.full_name} ({emp.employee_id})
              </option>
            ))}
          </select>
          <input type="date" name="date" value={form.date} onChange={handleChange} className="border p-2 rounded-lg" required />
          <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded-lg">
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
          <button type="submit" className="md:col-span-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Save Attendance
          </button>
        </form>
        {error && <p className="text-red-500 mt-3">{error}</p>}
      </div>

      {/* Attendance Records */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 className="text-lg font-medium">Attendance Records</h3>
          <div className="flex gap-4">
            <select
              name="employee_id"
              value={filters.employee_id}
              onChange={handleFilterChange}
              className="border p-2 rounded-lg"
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
              className="border p-2 rounded-lg"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading attendance...</p>
        ) : records.length === 0 ? (
          <p className="text-gray-500">No attendance records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-gray-600 text-sm uppercase tracking-wide">
                  <th className="text-left p-3">Employee</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3 font-medium">{rec.employee_name}</td>
                    <td className="p-3">{rec.date}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          rec.status === "Present"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
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
