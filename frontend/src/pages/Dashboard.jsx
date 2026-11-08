import { useEffect, useState } from "react";

function Dashboard({ setActivePage }) {
  const [attendance, setAttendance] = useState(0);
  const [averageMarks, setAverageMarks] = useState(0);
  const [assignmentRate, setAssignmentRate] = useState(0);
  const [subjects, setSubjects] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first.");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // =====================================================
      // STUDENT DASHBOARD APIs
      // =====================================================

      const [
        attendanceResponse,
        marksResponse,
        assignmentsResponse,
      ] = await Promise.all([
        // Student Attendance
        fetch(
          "http://127.0.0.1:8000/students/1/attendance-summary",
          {
            headers,
          }
        ),

        // Marks Analytics
        fetch(
          "http://127.0.0.1:8000/analytics/marks",
          {
            headers,
          }
        ),

        // Student Assignment Summary
        fetch(
          "http://127.0.0.1:8000/students/1/assignment-summary",
          {
            headers,
          }
        ),
      ]);

      // =====================================================
      // AUTHENTICATION CHECK
      // =====================================================

      if (
        attendanceResponse.status === 401 ||
        marksResponse.status === 401 ||
        assignmentsResponse.status === 401
      ) {
        throw new Error("Session expired. Please login again.");
      }

      // =====================================================
      // API ERROR CHECK
      // =====================================================

      if (
        !attendanceResponse.ok ||
        !marksResponse.ok ||
        !assignmentsResponse.ok
      ) {
        throw new Error(
          "Unable to load dashboard data."
        );
      }

      // =====================================================
      // RESPONSE DATA
      // =====================================================

      const attendanceData =
        await attendanceResponse.json();

      const marksData =
        await marksResponse.json();

      const assignmentsData =
        await assignmentsResponse.json();

      console.log(
        "STUDENT DASHBOARD ATTENDANCE:",
        attendanceData
      );

      console.log(
        "STUDENT DASHBOARD MARKS:",
        marksData
      );

      console.log(
        "STUDENT DASHBOARD ASSIGNMENTS:",
        assignmentsData
      );

      // =====================================================
      // ATTENDANCE
      // API:
      // /students/1/attendance-summary
      // attendance_percentage = 80
      // =====================================================

      setAttendance(
        Number(
          attendanceData.attendance_percentage ??
            attendanceData.percentage ??
            attendanceData.overall_percentage ??
            0
        )
      );

      // =====================================================
      // AVERAGE MARKS
      // =====================================================

      setAverageMarks(
        Number(
          marksData.average_marks ??
            marksData.average ??
            marksData.avg_marks ??
            0
        )
      );

      // =====================================================
      // ASSIGNMENT SUBMISSION
      // API:
      // /students/1/assignment-summary
      // submission_rate = 100
      // =====================================================

      setAssignmentRate(
        Number(
          assignmentsData.submission_rate ??
            assignmentsData.submission_percentage ??
            assignmentsData.percentage ??
            assignmentsData.completion_rate ??
            0
        )
      );

      // =====================================================
      // SUBJECT COUNT
      // =====================================================

      setSubjects(
        Number(
          marksData.total_subjects ??
            marksData.subjects_count ??
            marksData.subject_count ??
            marksData.subject_wise_marks?.length ??
            0
        )
      );

    } catch (err) {
      console.error(
        "DASHBOARD ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to load dashboard."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">

      {/* =========================
          HEADER
      ========================= */}

      <div className="dashboard-header">

        <div>

          <h1>
            Student Dashboard
          </h1>

          <p>
            Welcome back to CampusIQ 👋
          </p>

        </div>

      </div>


      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className="dashboard-message">
          Loading dashboard...
        </div>
      )}


      {/* =========================
          ERROR
      ========================= */}

      {!loading && error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}


      {/* =========================
          DASHBOARD CONTENT
      ========================= */}

      {!loading && !error && (
        <>

          {/* =========================
              STAT CARDS
          ========================= */}

          <div className="stats-grid">

            {/* ATTENDANCE */}

            <div className="stat-card">

              <h3>
                Attendance
              </h3>

              <p>
                {attendance}%
              </p>

              <span>
                Overall Attendance
              </span>

            </div>


            {/* MARKS */}

            <div className="stat-card">

              <h3>
                Average Marks
              </h3>

              <p>
                {averageMarks}
              </p>

              <span>
                Across {subjects} Subjects
              </span>

            </div>


            {/* ASSIGNMENTS */}

            <div className="stat-card">

              <h3>
                Assignments
              </h3>

              <p>
                {assignmentRate}%
              </p>

              <span>
                Submission Rate
              </span>

            </div>


            {/* SUBJECTS */}

            <div className="stat-card">

              <h3>
                Subjects
              </h3>

              <p>
                {subjects}
              </p>

              <span>
                Current Semester
              </span>

            </div>

          </div>


          {/* =========================
              DASHBOARD GRID
          ========================= */}

          <div className="dashboard-grid">


            {/* =========================
                ACADEMIC OVERVIEW
            ========================= */}

            <div className="dashboard-card">

              <h2>
                Academic Overview
              </h2>


              {/* ATTENDANCE */}

              <div className="progress-item">

                <div>

                  <span>
                    Attendance
                  </span>

                  <strong>
                    {attendance}%
                  </strong>

                </div>

                <div className="progress-bar">

                  <div
                    className="progress-fill attendance"
                    style={{
                      width: `${Math.min(
                        attendance,
                        100
                      )}%`,
                    }}
                  ></div>

                </div>

              </div>


              {/* ASSIGNMENTS */}

              <div className="progress-item">

                <div>

                  <span>
                    Assignment Submission
                  </span>

                  <strong>
                    {assignmentRate}%
                  </strong>

                </div>

                <div className="progress-bar">

                  <div
                    className="progress-fill assignments"
                    style={{
                      width: `${Math.min(
                        assignmentRate,
                        100
                      )}%`,
                    }}
                  ></div>

                </div>

              </div>


              {/* MARKS */}

              <div className="progress-item">

                <div>

                  <span>
                    Average Marks
                  </span>

                  <strong>
                    {averageMarks}
                  </strong>

                </div>

                <div className="progress-bar">

                  <div
                    className="progress-fill marks"
                    style={{
                      width: `${Math.min(
                        averageMarks,
                        100
                      )}%`,
                    }}
                  ></div>

                </div>

              </div>

            </div>


            {/* =========================
                QUICK ACTIONS
            ========================= */}

            <div className="dashboard-card">

              <h2>
                Quick Actions
              </h2>

              <div className="quick-actions">


                <button
                  onClick={() =>
                    setActivePage("notes")
                  }
                >
                  📚 Notes
                </button>


                <button
                  onClick={() =>
                    setActivePage("assignments")
                  }
                >
                  📝 Assignments
                </button>


                <button
                  onClick={() =>
                    setActivePage("attendance")
                  }
                >
                  📊 Attendance
                </button>


                <button
                  onClick={() =>
                    setActivePage("marks")
                  }
                >
                  📈 Marks & Performance
                </button>


                <button
                  onClick={() =>
                    setActivePage("timetable")
                  }
                >
                  📅 Timetable
                </button>


                <button
                  onClick={() =>
                    setActivePage("exams")
                  }
                >
                  📝 Examinations
                </button>


                <button
                  onClick={() =>
                    setActivePage("notices")
                  }
                >
                  📢 Notices
                </button>


                <button
                  onClick={() =>
                    setActivePage("events")
                  }
                >
                  🎉 Campus Events
                </button>


                <button
                  onClick={() =>
                    setActivePage("faculty")
                  }
                >
                  👨‍🏫 Faculty
                </button>


                <button
                  onClick={() =>
                    setActivePage("profile")
                  }
                >
                  👤 My Profile
                </button>


                <button
                  onClick={() =>
                    setActivePage("analytics")
                  }
                >
                  📊 Academic Analytics
                </button>


                <button
                  onClick={() =>
                    setActivePage("support")
                  }
                >
                  🤖 AI Support Indicator
                </button>


                <button
                  onClick={() =>
                    setActivePage("faculty-dashboard")
                  }
                >
                  👨‍🏫 Faculty Dashboard
                </button>


                <button
                  onClick={() =>
                    setActivePage("ai")
                  }
                >
                  🤖 Ask AI
                </button>


              </div>

            </div>

          </div>

        </>
      )}

    </div>
  );
}

export default Dashboard;