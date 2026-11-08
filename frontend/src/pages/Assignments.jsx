
import { useEffect, useState } from "react";

const BACKEND_URL = "http://127.0.0.1:8000";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const subjectNames = {
    1: "Data Communication",
    2: "Formal Language and Automata",
    3: "Software Engineering",
    4: "Soft Computing",
    5: "Java Programming",
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        throw new Error("Please login first.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Load assignment list
      const response = await fetch(
        `${BACKEND_URL}/assignments/`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(
          `Unable to load assignments. Status: ${response.status}`
        );
      }

      const data = await response.json();

      const list = Array.isArray(data)
        ? data
        : data.assignments || data.data || [];

      setAssignments(list);

      // Student-only summary
      if (role === "student") {
        const summaryResponse = await fetch(
          `${BACKEND_URL}/students/1/assignment-summary`,
          { headers }
        );

        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          setSummary(summaryData);
        } else {
          console.warn(
            "Assignment summary unavailable:",
            summaryResponse.status
          );
        }
      }
    } catch (err) {
      console.error("Assignments error:", err);
      setError(err.message || "Unable to load assignments.");
    } finally {
      setLoading(false);
    }
  };

  const getSubjectName = (item) => {
    return (
      item.subject_name ||
      item.subject?.name ||
      subjectNames[item.subject_id] ||
      item.subject ||
      `Subject ID: ${item.subject_id || "N/A"}`
    );
  };

  const getStatus = (item) => {
    return (
      item.status ||
      item.submission_status ||
      "Pending"
    );
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime())
      ? "Not specified"
      : parsed.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="assignments-page">
        <div className="assignments-message">
          Loading assignments...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assignments-page">
        <div className="assignments-error">
          {error}
          <button onClick={loadAssignments}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="assignments-page">
      <div className="page-header">
        <div>
          <h1>Assignments 📝</h1>
          <p>View assignments and submission status.</p>
        </div>
      </div>

      {summary && (
        <div className="assignment-summary-bar">
          <div>
            <span>Total Assignments</span>
            <strong>{summary.total_assignments ?? 0}</strong>
          </div>

          <div>
            <span>Submitted</span>
            <strong>{summary.submitted ?? 0}</strong>
          </div>

          <div>
            <span>Pending</span>
            <strong>{summary.pending ?? 0}</strong>
          </div>

          <div>
            <span>Submission Rate</span>
            <strong>{summary.submission_rate ?? 0}%</strong>
          </div>
        </div>
      )}

      {assignments.length > 0 ? (
        <div className="assignments-grid">
          {assignments.map((item, index) => {
            const status = getStatus(item);

            return (
              <div
                className="assignment-card"
                key={item.id || index}
              >
                <div className="assignment-top">
                  <div className="assignment-icon">
                    📝
                  </div>

                  <span
                    className={`assignment-status ${
                      String(status).toLowerCase().includes("submit")
                        ? "status-submitted"
                        : "status-pending"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <h2>
                  {item.title || item.name || "Assignment"}
                </h2>

                <p className="assignment-subject">
                  📚 {getSubjectName(item)}
                </p>

                {item.description && (
                  <p className="assignment-description">
                    {item.description}
                  </p>
                )}

                <div className="assignment-details">
                  <div>
                    <span>Due Date</span>
                    <strong>
                      {formatDate(item.due_date)}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="assignments-message">
          <h3>No Assignments Available</h3>
          <p>No assignments were found.</p>
        </div>
      )}
    </div>
  );
}

export default Assignments;
