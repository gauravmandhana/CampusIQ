import { useEffect, useState } from "react";

function SupportIndicator() {
  const [attendance, setAttendance] = useState(0);
  const [averageMarks, setAverageMarks] = useState(0);
  const [assignmentRate, setAssignmentRate] = useState(0);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAcademicData();
  }, []);

  const loadAcademicData = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const [
        attendanceResponse,
        marksResponse,
        assignmentsResponse,
      ] = await Promise.all([
        fetch(
          "http://127.0.0.1:8000/analytics/attendance",
          { headers }
        ),

        fetch(
          "http://127.0.0.1:8000/analytics/marks",
          { headers }
        ),

        fetch(
          "http://127.0.0.1:8000/analytics/assignments",
          { headers }
        ),
      ]);

      if (
        attendanceResponse.status === 401 ||
        marksResponse.status === 401 ||
        assignmentsResponse.status === 401
      ) {
        throw new Error("Please login first.");
      }

      if (
        !attendanceResponse.ok ||
        !marksResponse.ok ||
        !assignmentsResponse.ok
      ) {
        throw new Error(
          "Unable to load academic data."
        );
      }

      const attendanceData =
        await attendanceResponse.json();

      const marksData =
        await marksResponse.json();

      const assignmentsData =
        await assignmentsResponse.json();

      const attendanceValue = Number(
        attendanceData.attendance_percentage ??
          attendanceData.percentage ??
          attendanceData.overall_percentage ??
          0
      );

      const marksValue = Number(
        marksData.average_marks ??
          marksData.average ??
          marksData.avg_marks ??
          0
      );

      const assignmentValue = Number(
        assignmentsData.submission_rate ??
          assignmentsData.submission_percentage ??
          assignmentsData.percentage ??
          assignmentsData.completion_rate ??
          0
      );

      setAttendance(attendanceValue);
      setAverageMarks(marksValue);
      setAssignmentRate(assignmentValue);

      await predictSupport(
        attendanceValue,
        marksValue,
        assignmentValue
      );

    } catch (err) {
      console.error(
        "SUPPORT INDICATOR ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to load support indicator."
      );
    } finally {
      setLoading(false);
    }
  };

  const predictSupport = async (
    attendanceValue,
    marksValue,
    assignmentValue
  ) => {
    try {
      setPredicting(true);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/ml/predict-support",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            attendance_percentage:
              attendanceValue,

            average_marks:
              marksValue,

            assignment_submission_rate:
              assignmentValue,
          }),
        }
      );

      if (response.status === 401) {
        throw new Error(
          "Please login first."
        );
      }

      if (!response.ok) {
        throw new Error(
          `Prediction failed. Status: ${response.status}`
        );
      }

      const data =
        await response.json();

      console.log(
        "ML SUPPORT RESPONSE:",
        data
      );

      setResult(data);

    } catch (err) {
      console.error(
        "ML PREDICTION ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to generate support indicator."
      );
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="support-page">

      {/* Header */}

      <div className="page-header">

        <div>
          <h1>
            AI Academic Support 🤖
          </h1>

          <p>
            An ML-based indicator using your
            academic performance data.
          </p>
        </div>

      </div>

      {/* Loading */}

      {loading && (
        <div className="support-message">
          Loading academic data...
        </div>
      )}

      {/* Error */}

      {!loading && error && (
        <div className="support-error">
          {error}
        </div>
      )}

      {!loading && !error && (

        <div className="support-content">

          {/* Input Data */}

          <div className="support-panel">

            <h2>
              Academic Indicators
            </h2>

            <p>
              These values are used by the
              ML support model.
            </p>

            <div className="support-stats">

              <div className="support-stat">

                <span>
                  Attendance
                </span>

                <strong>
                  {attendance}%
                </strong>

              </div>

              <div className="support-stat">

                <span>
                  Average Marks
                </span>

                <strong>
                  {averageMarks}
                </strong>

              </div>

              <div className="support-stat">

                <span>
                  Assignment Rate
                </span>

                <strong>
                  {assignmentRate}%
                </strong>

              </div>

            </div>

          </div>

          {/* Prediction */}

          <div className="support-result-panel">

            <h2>
              ML Support Indicator
            </h2>

            {predicting && (
              <div className="prediction-loading">
                Analyzing academic indicators...
              </div>
            )}

            {!predicting && result && (

              <div
                className={
                  result.prediction === 1 ||
                  result.support_required === true
                    ? "support-result required"
                    : "support-result normal"
                }
              >

                <div className="support-result-icon">
                  {result.prediction === 1 ||
                  result.support_required === true
                    ? "⚠️"
                    : "✅"}
                </div>

                <div>

                  <h3>
                    {result.message ||
                      result.prediction_label ||
                      (
                        result.prediction === 1
                          ? "Support Required"
                          : "No Immediate Support Required"
                      )}
                  </h3>

                  <p>
                    This is an academic
                    support indicator based
                    on the available performance
                    data.
                  </p>

                </div>

              </div>

            )}

          </div>

          {/* Explanation */}

          <div className="support-info">

            <h2>
              About This Indicator
            </h2>

            <ul>
              <li>
                Attendance, marks and
                assignment performance are
                considered.
              </li>

              <li>
                The model identifies whether
                additional academic support
                may be useful.
              </li>

              <li>
                This result is an indicator,
                not a definitive prediction
                of academic success or failure.
              </li>
            </ul>

          </div>

        </div>
      )}

    </div>
  );
}

export default SupportIndicator;