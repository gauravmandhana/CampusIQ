import { useEffect, useState } from "react";

function Marks() {
  const [marks, setMarks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/analytics/marks",
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
          `Unable to load marks. Status: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("MARKS API RESPONSE:", data);

      setMarks(data);
    } catch (err) {
      console.error("MARKS ERROR:", err);

      setError(
        err?.message ||
          "Something went wrong while loading marks."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="marks-page">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Marks & Performance 📈</h1>
          <p>
            View your subject-wise academic performance.
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="marks-message">
          Loading marks...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="marks-error">
          {error}
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && marks && (
        <div className="marks-content">

          {/* Summary Cards */}
          <div className="marks-summary">

            <div className="marks-card">
              <span>Average Marks</span>
              <strong>
                {marks.average_marks ?? 0}
              </strong>
            </div>

            <div className="marks-card">
              <span>Total Marks</span>
              <strong>
                {marks.total_marks ?? 0}
              </strong>
            </div>

            <div className="marks-card">
              <span>Highest Marks</span>
              <strong>
                {marks.highest_marks ?? 0}
              </strong>
            </div>

            <div className="marks-card">
              <span>Lowest Marks</span>
              <strong>
                {marks.lowest_marks ?? 0}
              </strong>
            </div>

          </div>

          {/* Performance Overview */}
          <div className="marks-details">

            <h2>Overall Performance</h2>

            <div className="marks-progress">

              <div className="marks-progress-header">
                <span>Average Performance</span>

                <strong>
                  {marks.average_marks ?? 0}
                </strong>
              </div>

              <div className="marks-progress-bar">

                <div
                  className="marks-progress-fill"
                  style={{
                    width: `${Math.min(
                      marks.average_marks ?? 0,
                      100
                    )}%`,
                  }}
                ></div>

              </div>

            </div>

          </div>

          {/* Subject-wise Marks */}
          <div className="subject-marks-section">

            <div className="subject-marks-header">
              <div>
                <h2>Subject-wise Marks</h2>

                <p>
                  Detailed marks for each subject.
                </p>
              </div>
            </div>

            <div className="marks-table-wrapper">

              <table className="marks-table">

                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Internal</th>
                    <th>Midterm</th>
                    <th>Practical</th>
                    <th>End Term</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>

                  {marks.subject_wise_marks &&
                  marks.subject_wise_marks.length > 0 ? (

                    marks.subject_wise_marks.map(
                      (subject, index) => (
                        <tr key={index}>

                          <td>
                            <strong>
                              {subject.subject_name ||
                                "Unknown Subject"}
                            </strong>
                          </td>

                          <td>
                            {subject.internal_marks ?? "-"}
                          </td>

                          <td>
                            {subject.midterm_marks ?? "-"}
                          </td>

                          <td>
                            {subject.practical_marks ?? "-"}
                          </td>

                          <td>
                            {subject.endterm_marks ?? "-"}
                          </td>

                          <td>
                            <strong className="total-mark">
                              {subject.total_marks ?? "-"}
                            </strong>
                          </td>

                        </tr>
                      )
                    )

                  ) : (

                    <tr>
                      <td
                        colSpan="6"
                        className="no-marks"
                      >
                        No subject-wise marks available.
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Marks;