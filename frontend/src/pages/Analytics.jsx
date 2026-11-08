import {
  useEffect,
  useState,
} from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

function Analytics() {
  const [attendance, setAttendance] =
    useState(null);

  const [marks, setMarks] =
    useState(null);

  const [assignments, setAssignments] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token =
        localStorage.getItem("token");

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
        throw new Error(
          "Please login first."
        );
      }

      if (
        !attendanceResponse.ok ||
        !marksResponse.ok ||
        !assignmentsResponse.ok
      ) {
        throw new Error(
          "Unable to load analytics data."
        );
      }

      const attendanceData =
        await attendanceResponse.json();

      const marksData =
        await marksResponse.json();

      const assignmentsData =
        await assignmentsResponse.json();

      console.log(
        "ATTENDANCE ANALYTICS:",
        attendanceData
      );

      console.log(
        "MARKS ANALYTICS:",
        marksData
      );

      console.log(
        "ASSIGNMENT ANALYTICS:",
        assignmentsData
      );

      setAttendance(attendanceData);
      setMarks(marksData);
      setAssignments(assignmentsData);

    } catch (err) {
      console.error(
        "ANALYTICS ERROR:",
        err
      );

      setError(
        err?.message ||
          "Something went wrong while loading analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     VALUES
  ========================= */

  const attendancePercentage =
    Number(
      attendance?.attendance_percentage ??
      attendance?.percentage ??
      attendance?.overall_percentage ??
      0
    );

  const present =
    Number(
      attendance?.present ??
      attendance?.present_count ??
      0
    );

  const absent =
    Number(
      attendance?.absent ??
      attendance?.absent_count ??
      0
    );

  const averageMarks =
    Number(
      marks?.average_marks ??
      marks?.average ??
      marks?.avg_marks ??
      0
    );

  const assignmentRate =
    Number(
      assignments?.submission_rate ??
      assignments?.submission_percentage ??
      assignments?.percentage ??
      assignments?.completion_rate ??
      0
    );

  const totalAssignments =
    Number(
      assignments?.total_assignments ??
      assignments?.total ??
      0
    );

  const submittedAssignments =
    Number(
      assignments?.submitted_assignments ??
      assignments?.submitted ??
      assignments?.completed ??
      0
    );

  const pendingAssignments =
    Number(
      assignments?.pending_assignments ??
      assignments?.pending ??
      Math.max(
        totalAssignments -
          submittedAssignments,
        0
      )
    );

  const subjectMarks =
    marks?.subject_wise_marks || [];

  /* =========================
     CHART DATA
  ========================= */

  const subjectChartData =
    subjectMarks.map((subject) => ({
      name:
        subject.subject_name ||
        "Unknown",

      marks:
        Number(
          subject.total_marks
        ) || 0,
    }));

  const attendanceChartData = [
    {
      name: "Present",
      value: present,
    },
    {
      name: "Absent",
      value: absent,
    },
  ];

  const assignmentChartData = [
    {
      name: "Submitted",
      value: submittedAssignments,
    },
    {
      name: "Pending",
      value: pendingAssignments,
    },
  ];

  const performanceChartData = [
    {
      name: "Attendance",
      value: attendancePercentage,
    },
    {
      name: "Marks",
      value: averageMarks,
    },
    {
      name: "Assignments",
      value: assignmentRate,
    },
  ];

  return (
    <div className="analytics-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">

        <div>
          <h1>
            Academic Analytics 📊
          </h1>

          <p>
            Analyze your academic
            performance and progress.
          </p>
        </div>

      </div>

      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className="analytics-message">
          Loading analytics...
        </div>
      )}

      {/* =========================
          ERROR
      ========================= */}

      {!loading && error && (
        <div className="analytics-error">
          {error}
        </div>
      )}

      {/* =========================
          MAIN
      ========================= */}

      {!loading &&
        !error &&
        attendance &&
        marks &&
        assignments && (

          <div className="analytics-content">

            {/* =========================
                SUMMARY CARDS
            ========================= */}

            <div className="analytics-summary">

              <div className="analytics-card">
                <span>
                  Attendance
                </span>

                <strong>
                  {attendancePercentage}%
                </strong>

                <small>
                  Overall attendance
                </small>
              </div>

              <div className="analytics-card">
                <span>
                  Average Marks
                </span>

                <strong>
                  {averageMarks}
                </strong>

                <small>
                  Across subjects
                </small>
              </div>

              <div className="analytics-card">
                <span>
                  Assignment Rate
                </span>

                <strong>
                  {assignmentRate}%
                </strong>

                <small>
                  Submission performance
                </small>
              </div>

              <div className="analytics-card">
                <span>
                  Subjects
                </span>

                <strong>
                  {marks.total_subjects ??
                    subjectMarks.length}
                </strong>

                <small>
                  Current semester
                </small>
              </div>

            </div>

            {/* =========================
                CHART ROW 1
            ========================= */}

            <div className="charts-grid">

              {/* Subject Marks */}

              <div className="chart-card">

                <h2>
                  Subject-wise Marks
                </h2>

                <p>
                  Total marks obtained
                  in each subject.
                </p>

                <div className="chart-container">

                  <ResponsiveContainer
                    width="100%"
                    height={320}
                  >

                    <BarChart
                      data={subjectChartData}
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                      />

                      <XAxis
                        dataKey="name"
                        tick={{
                          fontSize: 11,
                        }}
                      />

                      <YAxis
                        domain={[0, 100]}
                      />

                      <Tooltip />

                      <Bar
                        dataKey="marks"
                        name="Marks"
                        fill="#2563eb"
                        radius={[
                          6,
                          6,
                          0,
                          0,
                        ]}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </div>

              {/* Attendance */}

              <div className="chart-card">

                <h2>
                  Attendance Overview
                </h2>

                <p>
                  Present vs absent classes.
                </p>

                <div className="chart-container">

                  <ResponsiveContainer
                    width="100%"
                    height={320}
                  >

                    <PieChart>

                      <Pie
                        data={
                          attendanceChartData
                        }
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={105}
                        label
                      >

                        <Cell
                          fill="#2563eb"
                        />

                        <Cell
                          fill="#ef4444"
                        />

                      </Pie>

                      <Tooltip />

                      <Legend />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

              </div>

            </div>

            {/* =========================
                CHART ROW 2
            ========================= */}

            <div className="charts-grid">

              {/* Overall Performance */}

              <div className="chart-card">

                <h2>
                  Overall Performance
                </h2>

                <p>
                  Comparison of key
                  academic indicators.
                </p>

                <div className="chart-container">

                  <ResponsiveContainer
                    width="100%"
                    height={320}
                  >

                    <LineChart
                      data={
                        performanceChartData
                      }
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                      />

                      <XAxis
                        dataKey="name"
                      />

                      <YAxis
                        domain={[0, 100]}
                      />

                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Performance"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{
                          r: 6,
                        }}
                      />

                    </LineChart>

                  </ResponsiveContainer>

                </div>

              </div>

              {/* Assignment */}

              <div className="chart-card">

                <h2>
                  Assignment Status
                </h2>

                <p>
                  Submitted vs pending
                  assignments.
                </p>

                <div className="chart-container">

                  <ResponsiveContainer
                    width="100%"
                    height={320}
                  >

                    <BarChart
                      data={
                        assignmentChartData
                      }
                    >

                      <CartesianGrid
                        strokeDasharray="3 3"
                      />

                      <XAxis
                        dataKey="name"
                      />

                      <YAxis />

                      <Tooltip />

                      <Bar
                        dataKey="value"
                        name="Assignments"
                        fill="#16a34a"
                        radius={[
                          6,
                          6,
                          0,
                          0,
                        ]}
                      />

                    </BarChart>

                  </ResponsiveContainer>

                </div>

              </div>

            </div>

            {/* =========================
                MARKS SUMMARY
            ========================= */}

            <div className="analytics-panel">

              <h2>
                Marks Summary
              </h2>

              <div className="marks-summary-list">

                <div>
                  <span>
                    Total Marks
                  </span>

                  <strong>
                    {marks.total_marks ?? 0}
                  </strong>
                </div>

                <div>
                  <span>
                    Highest Marks
                  </span>

                  <strong>
                    {marks.highest_marks ?? 0}
                  </strong>
                </div>

                <div>
                  <span>
                    Lowest Marks
                  </span>

                  <strong>
                    {marks.lowest_marks ?? 0}
                  </strong>
                </div>

                <div>
                  <span>
                    Average
                  </span>

                  <strong>
                    {averageMarks}
                  </strong>
                </div>

              </div>

            </div>

          </div>
        )}

    </div>
  );
}

export default Analytics;