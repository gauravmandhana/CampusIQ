import { useEffect, useState } from "react";

function Profile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/students/1",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        throw new Error("Please login first.");
      }

      if (!response.ok) {
        throw new Error(
          `Unable to load profile. Status: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("PROFILE API RESPONSE:", data);

      setStudent(data);
    } catch (err) {
      console.error("PROFILE ERROR:", err);

      setError(
        err?.message ||
          "Something went wrong while loading profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>My Profile 👤</h1>
          <p>
            View your student information.
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="profile-message">
          Loading profile...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="profile-error">
          {error}
        </div>
      )}

      {/* Profile */}
      {!loading && !error && student && (
        <div className="profile-card">

          {/* Profile Header */}
          <div className="profile-header">

            <div className="profile-avatar">
              👨‍🎓
            </div>

            <div>
              <h2>
                {student.name ||
                  student.full_name ||
                  student.username ||
                  "Student"}
              </h2>

              <p>
                {student.department ||
                  "Computer Science & Engineering"}
              </p>
            </div>

          </div>

          {/* Student Details */}
          <div className="profile-details">

            <div className="profile-item">
              <span>🆔 Student ID</span>
              <strong>
                {student.student_id || "-"}
              </strong>
            </div>

            <div className="profile-item">
              <span>🎓 Roll Number</span>
              <strong>
                {student.roll_number || "-"}
              </strong>
            </div>

            <div className="profile-item">
              <span>🏫 Department</span>
              <strong>
                {student.department || "-"}
              </strong>
            </div>

            <div className="profile-item">
              <span>📚 Semester</span>
              <strong>
                {student.semester
                  ? `Semester ${student.semester}`
                  : "-"}
              </strong>
            </div>

            <div className="profile-item">
              <span>📌 Section</span>
              <strong>
                {student.section || "-"}
              </strong>
            </div>

            <div className="profile-item">
              <span>📅 Enrollment Year</span>
              <strong>
                {student.enrollment_year || "-"}
              </strong>
            </div>

            <div className="profile-item">
              <span>👤 Username</span>
              <strong>
                {student.username || "-"}
              </strong>
            </div>

            <div className="profile-item">
              <span>📧 Email</span>
              <strong>
                {student.email || "-"}
              </strong>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Profile;