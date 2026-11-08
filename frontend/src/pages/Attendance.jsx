
import { useEffect, useState } from "react";

const BACKEND_URL = "http://127.0.0.1:8000";

function Attendance() {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
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

      let data;

      // STUDENT ATTENDANCE
      if (role === "student") {
        const response = await fetch(
          `${BACKEND_URL}/students/1/attendance-summary`,
          {
            method: "GET",
            headers,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load attendance. Status: ${response.status}`
          );
        }

        data = await response.json();
      }

      // FACULTY AND ADMIN ATTENDANCE
      else if (role === "faculty" || role === "admin") {
        const [recordsResponse, summaryResponse] =
          await Promise.all([
            fetch(`${BACKEND_URL}/attendance/`, { headers }),
            fetch(`${BACKEND_URL}/attendance/summary`, { headers }),
          ]);

        if (!recordsResponse.ok) {
          throw new Error(
            `Unable to load attendance records. Status: ${recordsResponse.status}`
          );
        }

        if (!summaryResponse.ok) {
          throw new Error(
            `Unable to load attendance summary. Status: ${summaryResponse.status}`
          );
        }

        const recordsData = await recordsResponse.json();
        const summaryData = await summaryResponse.json();

        data = {
          ...summaryData,
          records: recordsData.attendance || [],
        };
      }

      else {
        throw new Error("Invalid user role.");
      }

      console.log("ATTENDANCE API RESPONSE:", data);

      setAttendance(data);

    } catch (err) {
      console.error("ATTENDANCE ERROR:", err);
      setError(
        err?.message || "Something went wrong while loading attendance."
      );
    } finally {
      setLoading(false);
    }
  };

  const attendancePercentage = Number(
    attendance?.attendance_percentage ??
    attendance?.percentage ??
    attendance?.overall_percentage ??
    0
  );

  const totalClasses = Number(
    attendance?.total_classes ??
    attendance?.total ??
    0
  );

  const present = Number(
    attendance?.present ??
    attendance?.present_count ??
    0
  );

  const absent = Number(
    attendance?.absent ??
    attendance?.absent_count ??
    0
  );

  return (
    <div className="attendance-page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>Attendance 📊</h1>
          <p>View attendance performance and records.</p>
        </div>
      </div>

      {/* LOADING */}

      {loading && (
        <div className="attendance-message">
          Loading attendance...
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="attendance-error">
          <p>{error}</p>

          <button onClick={fetchAttendance}>
            Retry
          </button>
        </div>
      )}

      {/* ATTENDANCE CONTENT */}

      {!loading && !error && attendance && (
        <div className="attendance-content">

          {/* SUMMARY CARDS */}

          <div className="attendance-summary">

            <div className="attendance-card">
              <span>Overall Attendance</span>
              <strong>{attendancePercentage}%</strong>
            </div>

            <div className="attendance-card">
              <span>Total Classes</span>
              <strong>{totalClasses}</strong>
            </div>

            <div className="attendance-card">
              <span>Present</span>
              <strong>{present}</strong>
            </div>

            <div className="attendance-card">
              <span>Absent</span>
              <strong>{absent}</strong>
            </div>

          </div>

          {/* ATTENDANCE DETAILS */}

          <div className="attendance-details">

            <h2>Attendance Details</h2>

            <div className="attendance-progress">

              <div className="progress-header">
                <span>Overall Attendance</span>
                <strong>{attendancePercentage}%</strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(
                      Math.max(attendancePercentage, 0),
                      100
                    )}%`,
                  }}
                />
              </div>

            </div>

            {/* CLASS BREAKDOWN */}

            <div className="attendance-breakdown">

              <div className="attendance-breakdown-item">
                <span>Total Classes</span>
                <strong>{totalClasses}</strong>
              </div>

              <div className="attendance-breakdown-item">
                <span>Classes Present</span>
                <strong>{present}</strong>
              </div>

              <div className="attendance-breakdown-item">
                <span>Classes Absent</span>
                <strong>{absent}</strong>
              </div>

            </div>

          </div>

          {/* FACULTY / ADMIN RECORDS */}

          {attendance.records && (
            <div className="attendance-details">
              <h2>Attendance Records</h2>

              {attendance.records.length > 0 ? (
                <div className="attendance-table-container">
                  <table className="attendance-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Student ID</th>
                        <th>Subject</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {attendance.records.map((record) => (
                        <tr key={record.id}>
                          <td>
                            {record.date
                              ? new Date(record.date).toLocaleDateString()
                              : "N/A"}
                          </td>

                          <td>{record.student_id}</td>

                          <td>
                            {record.subject_name ||
                              `Subject ${record.subject_id}`}
                          </td>

                          <td>
                            {Number(record.status) === 1
                              ? "Present"
                              : "Absent"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No attendance records found.</p>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default Attendance;
