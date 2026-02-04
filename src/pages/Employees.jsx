import { useEffect, useState } from "react";
import api from "../api/axios";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

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

    try {
      await api.post("/employees/", form);
      setForm({ employee_id: "", full_name: "", email: "", department: "" });
      fetchEmployees();
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

    try {
      await api.delete(`/employees/${id}/`);
      fetchEmployees();
    } catch {
      alert("Failed to delete employee");
    }
  };

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-semibold text-gray-900">Employee Management</h2>

      {/* Add Employee Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Add New Employee</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input name="employee_id" value={form.employee_id} onChange={handleChange} placeholder="Employee ID" className="border p-2 rounded-lg" required />
          <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="Full Name" className="border p-2 rounded-lg" required />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded-lg" required />
          <input name="department" value={form.department} onChange={handleChange} placeholder="Department" className="border p-2 rounded-lg" required />
          <button type="submit" className="md:col-span-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Add Employee
          </button>
        </form>
        {error && <p className="text-red-500 mt-3">{error}</p>}
      </div>

      {/* Employee List */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Employee Directory</h3>
        {loading ? (
          <p className="text-gray-500">Loading employees...</p>
        ) : employees.length === 0 ? (
          <p className="text-gray-500">No employees found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-gray-600 text-sm uppercase tracking-wide">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Department</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">{emp.employee_id}</td>
                    <td className="p-3 font-medium">{emp.full_name}</td>
                    <td className="p-3 text-gray-600">{emp.email}</td>
                    <td className="p-3">{emp.department}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="text-red-600 hover:text-red-700 hover:underline transition"
                      >
                        Delete
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
