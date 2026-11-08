 import { useEffect, useState } from "react";

function Exams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/students/1/exams",
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
          `Unable to load exams. Status: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("EXAMS API RESPONSE:", data);

      if (Array.isArray(data)) {
        setExams(data);
      } else if (Array.isArray(data.exams)) {
        setExams(data.exams);
      } else if (Array.isArray(data.data)) {
        setExams(data.data);
      } else {
        setExams([]);
      }
    } catch (err) {
      console.error("EXAMS ERROR:", err);

      setError(
        err?.message ||
          "Something went wrong while loading exams."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exams-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Examinations 📝</h1>
          <p>
            View your upcoming and scheduled examinations.
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="exams-message">
          Loading examinations...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="exams-error">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && exams.length === 0 && (
        <div className="exams-message">
          No examination records available.
        </div>
      )}

      {/* Exam Cards */}
      {!loading && !error && exams.length > 0 && (
        <div className="exams-grid">

          {exams.map((exam, index) => (
            <div
              className="exam-card"
              key={exam.id || index}
            >

              <div className="exam-card-top">

                <span className="exam-type">
                  {exam.exam_type ||
                    exam.type ||
                    "Examination"}
                </span>

                <span className="exam-number">
                  #{index + 1}
                </span>

              </div>

              <h2>
                {exam.subject_name ||
                  exam.subject ||
                  exam.subject_title ||
                  exam.name ||
                  "Subject"}
              </h2>

              <div className="exam-info">

                <div className="exam-info-item">
                  <span>📅 Date</span>
                  <strong>
                    {exam.exam_date ||
                      exam.date ||
                      "-"}
                  </strong>
                </div>

                <div className="exam-info-item">
                  <span>⏰ Time</span>
                  <strong>
                    {exam.start_time &&
                    exam.end_time
                      ? `${exam.start_time} - ${exam.end_time}`
                      : exam.time ||
                        exam.time_slot ||
                        "-"}
                  </strong>
                </div>

                <div className="exam-info-item">
                  <span>🏫 Room</span>
                  <strong>
                    {exam.room ||
                      exam.room_number ||
                      "-"}
                  </strong>
                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Exams;