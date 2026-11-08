import { useEffect, useState } from "react";

function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/admin/subjects",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("ADMIN SUBJECTS:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to load subjects."
        );
      }

      if (Array.isArray(data)) {
        setSubjects(data);
      } else if (Array.isArray(data.subjects)) {
        setSubjects(data.subjects);
      } else {
        setSubjects([]);
      }
    } catch (err) {
      console.error("ADMIN SUBJECTS ERROR:", err);

      setError(
        err.message || "Unable to load subjects."
      );
    } finally {
      setLoading(false);
    }
  };


  // Search subjects
  const filteredSubjects = subjects.filter((subject) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return (
      String(subject.name || "")
        .toLowerCase()
        .includes(searchText) ||

      String(subject.code || "")
        .toLowerCase()
        .includes(searchText) ||

      String(subject.department || "")
        .toLowerCase()
        .includes(searchText)
    );
  });


  // View subject details
  const handleViewSubject = (subject) => {
    setSelectedSubject(subject);
  };


  // Close modal
  const handleCloseDetails = () => {
    setSelectedSubject(null);
  };


  return (
    <div className="admin-subjects-page">

      {/* PAGE HEADER */}

      <div className="admin-page-header">

        <div>
          <h1>
            Subject Management 📚
          </h1>

          <p>
            View and manage academic subjects in CampusIQ.
          </p>
        </div>

        <button onClick={fetchSubjects}>
          🔄 Refresh
        </button>

      </div>


      {/* TOTAL SUBJECTS */}

      <div className="admin-summary-card">

        <h2>
          Total Subjects
        </h2>

        <strong>
          {subjects.length}
        </strong>

        <span>
          Registered academic subjects
        </span>

      </div>


      {/* SUBJECT TABLE */}

      <div className="admin-table-card">

        <div className="student-list-header">

          <div>

            <h2>
              Subjects List
            </h2>

            <p>
              Showing {filteredSubjects.length} of{" "}
              {subjects.length} subjects
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
              placeholder="Search subjects..."
            />

          </div>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="admin-message">
            Loading subjects...
          </div>
        )}


        {/* ERROR */}

        {!loading && error && (
          <div className="admin-error">
            {error}
          </div>
        )}


        {/* SUBJECT DATA */}

        {!loading && !error && (

          <>
            {filteredSubjects.length === 0 ? (

              <div className="admin-message">
                {search
                  ? "No subjects match your search."
                  : "No subjects found."}
              </div>

            ) : (

              <div className="table-container">

                <table className="admin-table">

                  <thead>

                    <tr>

                      <th>ID</th>

                      <th>Subject Name</th>

                      <th>Subject Code</th>

                      <th>Department</th>

                      <th>Action</th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredSubjects.map(
                      (subject) => (

                        <tr key={subject.id}>

                          <td>
                            {subject.id}
                          </td>

                          <td>
                            {subject.name || "-"}
                          </td>

                          <td>
                            {subject.code || "-"}
                          </td>

                          <td>
                            {subject.department || "-"}
                          </td>

                          <td>

                            <button
                              className="view-student-btn"
                              onClick={() =>
                                handleViewSubject(subject)
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


      {/* SUBJECT DETAILS MODAL */}

      {selectedSubject && (

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
                  Subject Details 📚
                </h2>

                <p>
                  CampusIQ Academic Subject
                </p>

              </div>

              <button
                className="modal-close-btn"
                onClick={handleCloseDetails}
              >
                ✕
              </button>

            </div>


            {/* SUBJECT PROFILE */}

            <div className="student-profile-box">

              <div className="student-avatar">
                📚
              </div>

              <div>

                <h3>
                  {selectedSubject.name || "Subject"}
                </h3>

                <span>
                  Subject Code:{" "}
                  {selectedSubject.code || "-"}
                </span>

              </div>

            </div>


            {/* SUBJECT DETAILS */}

            <div className="student-details-grid">

              <div className="student-detail-item">

                <span>
                  Subject ID
                </span>

                <strong>
                  {selectedSubject.id || "-"}
                </strong>

              </div>


              <div className="student-detail-item">

                <span>
                  Subject Code
                </span>

                <strong>
                  {selectedSubject.code || "-"}
                </strong>

              </div>


              <div className="student-detail-item">

                <span>
                  Subject Name
                </span>

                <strong>
                  {selectedSubject.name || "-"}
                </strong>

              </div>


              <div className="student-detail-item">

                <span>
                  Department
                </span>

                <strong>
                  {selectedSubject.department || "-"}
                </strong>

              </div>

            </div>


            {/* FOOTER */}

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

export default AdminSubjects;