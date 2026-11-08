import { useEffect, useState } from "react";

function AdminDashboard({ setActivePage }) {
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    subjects: 0,
    notices: 0,
    users: 0,
  });

  const [attendance, setAttendance] = useState(null);
  const [marks, setMarks] = useState(null);
  const [assignments, setAssignments] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // =====================================================
      // ADMIN STATS
      // =====================================================

      const statsResponse = await fetch(
        "http://127.0.0.1:8000/admin/stats",
        {
          method: "GET",
          headers,
        }
      );

      const statsData = await statsResponse.json();

      console.log("ADMIN STATS:", statsData);

      if (!statsResponse.ok) {
        throw new Error(
          statsData.detail ||
            "Unable to load admin statistics."
        );
      }

      setStats({
        students: Number(statsData.students || 0),
        faculty: Number(statsData.faculty || 0),
        subjects: Number(statsData.subjects || 0),
        notices: Number(statsData.notices || 0),
        users: Number(statsData.users || 0),
      });

      // =====================================================
      // ATTENDANCE ANALYTICS
      // =====================================================

      try {
        const attendanceResponse = await fetch(
          "http://127.0.0.1:8000/analytics/attendance",
          {
            method: "GET",
            headers,
          }
        );

        const attendanceData =
          await attendanceResponse.json();

        console.log(
          "ADMIN ATTENDANCE:",
          attendanceData
        );

        if (attendanceResponse.ok) {
          setAttendance(attendanceData.analytics || {});
        }
      } catch (err) {
        console.error(
          "ADMIN ATTENDANCE ERROR:",
          err
        );
      }

      // =====================================================
      // MARKS ANALYTICS
      // =====================================================

      try {
        const marksResponse = await fetch(
          "http://127.0.0.1:8000/analytics/marks",
          {
            method: "GET",
            headers,
          }
        );

        const marksData =
          await marksResponse.json();

        console.log(
          "ADMIN MARKS:",
          marksData
        );

        if (marksResponse.ok) {
          setMarks(marksData);
        }
      } catch (err) {
        console.error(
          "ADMIN MARKS ERROR:",
          err
        );
      }

      // =====================================================
      // ASSIGNMENT ANALYTICS
      // =====================================================

      try {
        const assignmentsResponse = await fetch(
          "http://127.0.0.1:8000/analytics/assignments",
          {
            method: "GET",
            headers,
          }
        );

        const assignmentsData =
          await assignmentsResponse.json();

        console.log(
          "ADMIN ASSIGNMENTS:",
          assignmentsData
        );

        if (assignmentsResponse.ok) {
          setAssignments(assignmentsData.analytics || {});
        }
      } catch (err) {
        console.error(
          "ADMIN ASSIGNMENTS ERROR:",
          err
        );
      }
    } catch (err) {
      console.error(
        "ADMIN DASHBOARD ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-message">
          Loading Admin Dashboard...
        </div>
      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="admin-dashboard">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="admin-header">

        <div>
          <h1>
            Admin Dashboard 🛠️
          </h1>

          <p>
            Manage CampusIQ users, academics,
            notices and system analytics.
          </p>
        </div>

        <button
          className="admin-refresh-btn"
          onClick={fetchAdminData}
        >
          🔄 Refresh
        </button>

      </div>


      {/* =================================================
          ERROR
          ================================================= */}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}


      {/* =================================================
          STATISTICS
          ================================================= */}

      <div className="admin-stats">

        {/* STUDENTS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            👨‍🎓
          </div>

          <div>
            <span>
              Total Students
            </span>

            <strong>
              {stats.students}
            </strong>
          </div>

        </div>


        {/* FACULTY */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            👨‍🏫
          </div>

          <div>
            <span>
              Total Faculty
            </span>

            <strong>
              {stats.faculty}
            </strong>
          </div>

        </div>


        {/* SUBJECTS */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            📚
          </div>

          <div>
            <span>
              Total Subjects
            </span>

            <strong>
              {stats.subjects}
            </strong>
          </div>

        </div>


        {/* NOTICES */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            📢
          </div>

          <div>
            <span>
              Total Notices
            </span>

            <strong>
              {stats.notices}
            </strong>
          </div>

        </div>

      </div>


      {/* =================================================
          MANAGEMENT SECTION
          ================================================= */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>

            <h2>
              Management
            </h2>

            <p>
              Manage important CampusIQ resources.
            </p>

          </div>

        </div>


        <div className="admin-management-grid">


          {/* STUDENT MANAGEMENT */}

          <div className="admin-management-card">

            <div className="admin-management-icon">
              👨‍🎓
            </div>

            <h3>
              Student Management
            </h3>

            <p>
              View and manage registered students.
            </p>

            <button
              onClick={() =>
                setActivePage("admin-students")
              }
            >
              Manage Students
            </button>

          </div>


          {/* FACULTY MANAGEMENT */}

          <div className="admin-management-card">

            <div className="admin-management-icon">
              👨‍🏫
            </div>

            <h3>
              Faculty Management
            </h3>

            <p>
              View and manage faculty members.
            </p>

            <button
              onClick={() =>
                setActivePage("admin-faculty")
              }
            >
              Manage Faculty
            </button>

          </div>


          {/* SUBJECT MANAGEMENT */}

          <div className="admin-management-card">

            <div className="admin-management-icon">
              📚
            </div>

            <h3>
              Subject Management
            </h3>

            <p>
              View and manage academic subjects.
            </p>

            <button
              onClick={() =>
                setActivePage("admin-subjects")
              }
            >
              Manage Subjects
            </button>

          </div>


          {/* ASSIGNMENT MANAGEMENT */}

          <div className="admin-management-card">

            <div className="admin-management-icon">
              📝
            </div>

            <h3>
              Assignment Management
            </h3>

            <p>
              View and manage academic assignments.
            </p>

            <button
              onClick={() =>
                setActivePage("admin-assignments")
              }
            >
              Manage Assignments
            </button>

          </div>


          {/* NOTICE MANAGEMENT */}

          <div className="admin-management-card">

            <div className="admin-management-icon">
              📢
            </div>

            <h3>
              Notice Management
            </h3>

            <p>
              Manage campus notices and announcements.
            </p>

            <button
              onClick={() =>
                setActivePage("admin-notices")
              }
            >
              Manage Notices
            </button>

          </div>


        </div>

      </section>


      {/* =================================================
          ACADEMIC OVERVIEW
          ================================================= */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>

            <h2>
              Academic Overview 📊
            </h2>

            <p>
              Current CampusIQ academic statistics.
            </p>

          </div>

        </div>


        <div className="admin-academic-grid">


          {/* ATTENDANCE */}

          <div className="admin-academic-card">

            <div className="admin-academic-header">

              <h3>
                Attendance
              </h3>

              <span>
                📅
              </span>

            </div>

            <div className="admin-academic-value">

              {attendance
                ? `${attendance.attendance_percentage ?? 0}%`
                : "0%"}

            </div>

            <p>
              Overall attendance
            </p>

          </div>


          {/* MARKS */}

          <div className="admin-academic-card">

            <div className="admin-academic-header">

              <h3>
                Average Marks
              </h3>

              <span>
                📈
              </span>

            </div>

            <div className="admin-academic-value">

              {marks
                ? marks.average_marks ?? 0
                : 0}

            </div>

            <p>
              Average student marks
            </p>

          </div>


          {/* ASSIGNMENTS */}

          <div className="admin-academic-card">

            <div className="admin-academic-header">

              <h3>
                Assignment Submission
              </h3>

              <span>
                📝
              </span>

            </div>

            <div className="admin-academic-value">

              {assignments
                ? `${assignments.submission_rate ?? 0}%`
                : "0%"}

            </div>

            <p>
              Overall submission rate
            </p>

          </div>


        </div>

      </section>


      {/* =================================================
          QUICK ACTIONS
          ================================================= */}

      <section className="admin-section">

        <div className="admin-section-header">

          <div>

            <h2>
              Quick Actions ⚡
            </h2>

            <p>
              Access frequently used admin tools.
            </p>

          </div>

        </div>


        <div className="admin-quick-actions">


          {/* STUDENTS */}

          <button
            onClick={() =>
              setActivePage("admin-students")
            }
          >
            👨‍🎓

            <span>
              Students
            </span>

          </button>


          {/* FACULTY */}

          <button
            onClick={() =>
              setActivePage("admin-faculty")
            }
          >
            👨‍🏫

            <span>
              Faculty
            </span>

          </button>


          {/* SUBJECTS */}

          <button
            onClick={() =>
              setActivePage("admin-subjects")
            }
          >
            📚

            <span>
              Subjects
            </span>

          </button>


          {/* ASSIGNMENTS */}

          <button
            onClick={() =>
              setActivePage("admin-assignments")
            }
          >
            📝

            <span>
              Assignments
            </span>

          </button>


          {/* ANALYTICS */}

          <button
            onClick={() =>
              setActivePage("analytics")
            }
          >
            📊

            <span>
              Analytics
            </span>

          </button>


          {/* NOTICES */}

          <button
            onClick={() =>
              setActivePage("admin-notices")
            }
          >
            📢

            <span>
              Notices
            </span>

          </button>


          {/* SYSTEM SETTINGS */}

          <button
            onClick={() =>
              setActivePage("admin-system")
            }
          >
            ⚙️

            <span>
              System Settings
            </span>

          </button>


        </div>

      </section>


      {/* =================================================
          SYSTEM INFORMATION
          ================================================= */}

      <section className="admin-system-info">

        <div>

          <h3>
            CampusIQ System
          </h3>

          <p>
            AI-Powered Student Assistance &
            Campus Analytics Platform
          </p>

        </div>


        <div className="admin-system-status">

          <span className="status-dot"></span>

          System Online

        </div>

      </section>


    </div>
  );
}

export default AdminDashboard;