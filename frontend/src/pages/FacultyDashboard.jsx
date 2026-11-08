
import { useEffect, useState } from "react";

const BACKEND_URL = "http://127.0.0.1:8000";

function FacultyDashboard({ setActivePage }) {
  const [faculty, setFaculty] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFacultyDashboard();
  }, []);

  const fetchFacultyDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }

      const response = await fetch(
        `${BACKEND_URL}/faculty/1/dashboard`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        throw new Error("Session expired. Please login again.");
      }

      if (response.status === 403) {
        throw new Error(
          "You do not have permission to access this faculty dashboard."
        );
      }

      if (response.status === 404) {
        throw new Error(
          "Faculty dashboard not found. Please verify Faculty ID."
        );
      }

      if (!response.ok) {
        throw new Error(
          `Unable to load faculty dashboard. Status: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("FACULTY DASHBOARD RESPONSE:", data);

      if (!data.faculty) {
        throw new Error("Faculty profile not found.");
      }

      setFaculty(data.faculty);
      setSummary(data.summary || null);

    } catch (err) {
      console.error("FACULTY DASHBOARD ERROR:", err);

      setError(
        err.message || "Unable to load faculty dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // FACULTY ACTIVITIES

  const activities = [
    {
      title: "Notes",
      icon: "📚",
      description: "Upload and manage study material.",
      page: "notes",
    },
    {
      title: "Assignments",
      icon: "📝",
      description: "Manage student assignments.",
      page: "assignments",
    },
    {
      title: "Attendance",
      icon: "📊",
      description: "Monitor class attendance.",
      page: "attendance",
    },
    {
      title: "Marks",
      icon: "📈",
      description: "Manage student performance.",
      page: "marks",
    },
  ];

  const openActivity = (page) => {
    if (typeof setActivePage === "function") {
      setActivePage(page);
    } else {
      console.error("setActivePage is not connected.");
    }
  };

  return (
    <div className="faculty-dashboard-page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>Faculty Dashboard 👨‍🏫</h1>
          <p>
            Manage your academic activities through CampusIQ.
          </p>
        </div>
      </div>

      {/* LOADING */}

      {loading && (
        <div className="faculty-dashboard-message">
          Loading faculty dashboard...
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="faculty-dashboard-error">
          <p>{error}</p>

          <button
            type="button"
            onClick={fetchFacultyDashboard}
          >
            Try Again
          </button>
        </div>
      )}

      {/* DASHBOARD CONTENT */}

      {!loading && !error && faculty && (
        <div className="faculty-dashboard-content">

          {/* WELCOME CARD */}

          <div className="faculty-welcome-card">

            <div className="faculty-dashboard-avatar">
              👨‍🏫
            </div>

            <div>
              <h2>
                {faculty.name || "Faculty Member"}
              </h2>

              <p>
                {faculty.designation || "Faculty Member"}
              </p>

              <span>
                {faculty.department || "Department"}
              </span>
            </div>

          </div>

          {/* FACULTY DETAILS */}

          <div className="faculty-stats-grid">

            <div className="faculty-stat-card">
              <span>Faculty ID</span>
              <strong>
                {faculty.faculty_id || "-"}
              </strong>
            </div>

            <div className="faculty-stat-card">
              <span>Department</span>
              <strong>
                {faculty.department || "-"}
              </strong>
            </div>

            <div className="faculty-stat-card">
              <span>Email</span>
              <strong>
                {faculty.email || "-"}
              </strong>
            </div>

            <div className="faculty-stat-card">
              <span>Phone</span>
              <strong>
                {faculty.phone || "-"}
              </strong>
            </div>

          </div>

          {/* FACULTY SUMMARY */}

          {summary && (
            <div className="faculty-stats-grid">

              <div className="faculty-stat-card">
                <span>Total Assignments</span>
                <strong>
                  {summary.total_assignments ?? 0}
                </strong>
              </div>

              <div className="faculty-stat-card">
                <span>Total Notes</span>
                <strong>
                  {summary.total_notes ?? 0}
                </strong>
              </div>

              <div className="faculty-stat-card">
                <span>Total Submissions</span>
                <strong>
                  {summary.total_submissions ?? 0}
                </strong>
              </div>

            </div>
          )}

          {/* FACULTY ACTIVITIES */}

          <div className="faculty-dashboard-panel">

            <h2>Faculty Activities</h2>

            <div className="faculty-actions">

              {activities.map((activity) => (
                <button
                  type="button"
                  className="faculty-action-card"
                  key={activity.page}
                  onClick={() => openActivity(activity.page)}
                >
                  <span>{activity.icon}</span>

                  <h3>{activity.title}</h3>

                  <p>{activity.description}</p>
                </button>
              ))}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default FacultyDashboard;
