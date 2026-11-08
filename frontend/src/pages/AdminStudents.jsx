import { useEffect, useState } from "react";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/admin/students",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("ADMIN STUDENTS:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to load students."
        );
      }

      if (Array.isArray(data)) {
        setStudents(data);
      } else if (Array.isArray(data.students)) {
        setStudents(data.students);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error("ADMIN STUDENTS ERROR:", err);

      setError(
        err.message || "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  // Search students
  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return (
      String(student.student_id || "")
        .toLowerCase()
        .includes(searchText) ||

      String(student.roll_number || "")
        .toLowerCase()
        .includes(searchText) ||

      String(student.department || "")
        .toLowerCase()
        .includes(searchText) ||

      String(student.semester || "")
        .toLowerCase()
        .includes(searchText) ||

      String(student.section || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  // Open student details
  const handleViewStudent = (student) => {
    setSelectedStudent(student);
  };

  // Close student details
  const handleCloseDetails = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="admin-students-page">

      {/* PAGE HEADER */}
      <div className="admin-page-header">

        <div>
          <h1>
            Student Management 👨‍🎓
          </h1>

          <p>
            View and manage registered CampusIQ students.
          </p>
        </div>

        <button onClick={fetchStudents}>
          🔄 Refresh
        </button>

      </div>


      {/* TOTAL STUDENTS */}
      <div className="admin-summary-card">

        <h2>
          Total Students
        </h2>

        <strong>
          {students.length}
        </strong>

        <span>
          Registered students
        </span>

      </div>


      {/* STUDENTS TABLE */}
      <div className="admin-table-card">

        <div className="student-list-header">

          <div>
            <h2>
              Students List
            </h2>

            <p>
              Showing {filteredStudents.length} of{" "}
              {students.length} students
            </p>
          </div>


          {/* SEARCH */}
          <div className="student-search-box">

            <span>
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search students..."
            />

          </div>

        </div>


        {/* LOADING */}
        {loading && (
          <div className="admin-message">
            Loading students...
          </div>
        )}


        {/* ERROR */}
        {!loading && error && (
          <div className="admin-error">
            {error}
          </div>
        )}


        {/* DATA */}
        {!loading && !error && (
          <>
            {filteredStudents.length === 0 ? (

              <div className="admin-message">
                {search
                  ? "No students match your search."
                  : "No students found."}
              </div>

            ) : (

              <div className="table-container">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Student ID</th>
                      <th>Roll Number</th>
                      <th>Department</th>
                      <th>Semester</th>
                      <th>Section</th>
                      <th>Enrollment Year</th>
                      <th>Action</th>
                    </tr>
                  </thead>


                  <tbody>

                    {filteredStudents.map(
                      (student) => (

                        <tr key={student.id}>

                          <td>
                            {student.id}
                          </td>

                          <td>
                            {student.student_id || "-"}
                          </td>

                          <td>
                            {student.roll_number || "-"}
                          </td>

                          <td>
                            {student.department || "-"}
                          </td>

                          <td>
                            {student.semester || "-"}
                          </td>

                          <td>
                            {student.section || "-"}
                          </td>

                          <td>
                            {student.enrollment_year || "-"}
                          </td>

                          <td>
                            <button
                              className="view-student-btn"
                              onClick={() =>
                                handleViewStudent(student)
                              }
                            >
                              👁️ View
                            </button>
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}
          </>
        )}

      </div>


      {/* STUDENT DETAILS MODAL */}
      {selectedStudent && (

        <div
          className="student-modal-overlay"
          onClick={handleCloseDetails}
        >

          <div
            className="student-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}
            <div className="student-modal-header">

              <div>
                <h2>
                  Student Details 👨‍🎓
                </h2>

                <p>
                  CampusIQ Student Profile
                </p>
              </div>

              <button
                className="modal-close-btn"
                onClick={handleCloseDetails}
              >
                ✕
              </button>

            </div>


            {/* STUDENT PROFILE */}
            <div className="student-profile-box">

              <div className="student-avatar">
                👨‍🎓
              </div>

              <div>
                <h3>
                  {selectedStudent.student_id || "Student"}
                </h3>

                <span>
                  Roll Number:{" "}
                  {selectedStudent.roll_number || "-"}
                </span>
              </div>

            </div>


            {/* DETAILS GRID */}
            <div className="student-details-grid">

              <div className="student-detail-item">
                <span>Student ID</span>
                <strong>
                  {selectedStudent.student_id || "-"}
                </strong>
              </div>

              <div className="student-detail-item">
                <span>Roll Number</span>
                <strong>
                  {selectedStudent.roll_number || "-"}
                </strong>
              </div>

              <div className="student-detail-item">
                <span>Department</span>
                <strong>
                  {selectedStudent.department || "-"}
                </strong>
              </div>

              <div className="student-detail-item">
                <span>Semester</span>
                <strong>
                  {selectedStudent.semester || "-"}
                </strong>
              </div>

              <div className="student-detail-item">
                <span>Section</span>
                <strong>
                  {selectedStudent.section || "-"}
                </strong>
              </div>

              <div className="student-detail-item">
                <span>Enrollment Year</span>
                <strong>
                  {selectedStudent.enrollment_year || "-"}
                </strong>
              </div>

            </div>


            {/* CLOSE BUTTON */}
            <div className="student-modal-footer">

              <button
                onClick={handleCloseDetails}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminStudents;