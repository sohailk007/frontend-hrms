import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const StatCard = ({ title, value, icon, accent, delay }) => (
  <div className="stat-card" style={{ animationDelay: delay }}>
    <div className="stat-card-header">
      <span className="stat-label">{title}</span>
      <div className="stat-icon" style={{ color: accent }}>
        {icon}
      </div>
    </div>
    <div className="stat-value" style={{ color: accent }}>{value}</div>
    <div className="stat-bar">
      <div className="stat-bar-fill" style={{ background: accent, width: "60%" }} />
    </div>
  </div>
);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get(`/dashboard/summary/?date=${today}`);
        setSummary(res.data);
      } catch (error) {
        console.error("Error fetching dashboard summary", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading)
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    );

  if (!summary)
    return <div className="error-state">Failed to load dashboard data.</div>;

  return (
    <div className="page-wrapper fade-in">
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard Overview</h2>
          <p className="page-subtitle">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="date-badge">Today</div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Employees"
          value={summary.total_employees}
          accent="#64FFDA"
          delay="0ms"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          }
        />
        <StatCard
          title="Attendance Records"
          value={summary.total_attendance_records}
          accent="#82B4FF"
          delay="80ms"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          }
        />
        <StatCard
          title="Present Today"
          value={summary.total_present_today ?? "—"}
          accent="#FFD580"
          delay="160ms"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          }
        />
      </div>

      <div className="dashboard-info-row">
        <div className="info-card">
          <h4 className="info-card-title">Quick Actions</h4>
          <div className="quick-actions">
            <Link to="/employees" className="quick-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Employee
            </Link>
            <Link to="/attendance" className="quick-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Mark Attendance
            </Link>
          </div>
        </div>
        <div className="info-card">
          <h4 className="info-card-title">System Status</h4>
          <div className="status-list">
            <div className="status-item">
              <span className="status-dot green" /> API Connected
            </div>
            <div className="status-item">
              <span className="status-dot green" /> Database Active
            </div>
            <div className="status-item">
              <span className="status-dot yellow" /> Last sync: just now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;