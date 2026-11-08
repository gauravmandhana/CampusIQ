import { useEffect, useState } from "react";

function Faculty() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/faculty/",
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
          `Unable to load faculty. Status: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("FACULTY API RESPONSE:", data);

      if (Array.isArray(data)) {
        setFaculty(data);
      } else if (Array.isArray(data.faculty)) {
        setFaculty(data.faculty);
      } else if (Array.isArray(data.data)) {
        setFaculty(data.data);
      } else {
        setFaculty([]);
      }
    } catch (err) {
      console.error("FACULTY ERROR:", err);

      setError(
        err?.message ||
          "Something went wrong while loading faculty."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faculty-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Faculty Information 👨‍🏫</h1>
          <p>
            View faculty members and their contact information.
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="faculty-message">
          Loading faculty information...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="faculty-error">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && faculty.length === 0 && (
        <div className="faculty-message">
          No faculty records available.
        </div>
      )}

      {/* Faculty Cards */}
      {!loading && !error && faculty.length > 0 && (
        <div className="faculty-grid">

          {faculty.map((member, index) => (
            <div
              className="faculty-card"
              key={member.id || index}
            >

              <div className="faculty-avatar">
                👨‍🏫
              </div>

              <div className="faculty-content">

                <div className="faculty-header-row">
                  <h2>
                    {member.name ||
                      member.faculty_name ||
                      "Faculty Member"}
                  </h2>

                  <span className="faculty-number">
                    #{index + 1}
                  </span>
                </div>

                <p className="faculty-designation">
                  {member.designation ||
                    "Faculty"}
                </p>

                <div className="faculty-info">

                  <div className="faculty-info-item">
                    <span>🆔 Faculty ID</span>
                    <strong>
                      {member.faculty_id || "-"}
                    </strong>
                  </div>

                  <div className="faculty-info-item">
                    <span>🏫 Department</span>
                    <strong>
                      {member.department || "-"}
                    </strong>
                  </div>

                  <div className="faculty-info-item">
                    <span>📧 Email</span>
                    <strong>
                      {member.email || "-"}
                    </strong>
                  </div>

                  <div className="faculty-info-item">
                    <span>📱 Phone</span>
                    <strong>
                      {member.phone || "-"}
                    </strong>
                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Faculty;