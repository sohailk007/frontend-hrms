import { useEffect, useState } from "react";
import api from "../api/axios";

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
  </div>
);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get("/dashboard/summary/");
        setSummary(res.data);
      } catch (error) {
        console.error("Error fetching dashboard summary", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p className="text-gray-500">Loading dashboard...</p>;
  if (!summary) return <p className="text-red-500">Failed to load dashboard.</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Employees" value={summary.total_employees} />
        <StatCard title="Attendance Records" value={summary.total_attendance_records} />
        <StatCard title="Present Today" value={summary.total_present_today ?? "—"} />
      </div>
    </div>
  );
};

export default Dashboard;
