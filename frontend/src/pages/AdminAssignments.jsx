import { useEffect, useState } from "react";

function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/admin/assignments",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("ADMIN ASSIGNMENTS:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to load assignments."
        );
      }

      if (Array.isArray(data)) {
        setAssignments(data);
      } else {
        setAssignments([]);
      }
    } catch (err) {
      console.error("ADMIN ASSIGNMENTS ERROR:", err);

      setError(
        err.message || "Unable to load assignments."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const searchText = search.toLowerCase();

    return (
      (assignment.title || "")
        .toLowerCase()
        .includes(searchText) ||
      (assignment.subject_name || "")
        .toLowerCase()
        .includes(searchText) ||
      (assignment.faculty_name || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  return (
    <div className="admin-assignments-page">

      {/* ================= HEADER ================= */}

      <div className="admin-page-header">
        <div>
          <h1>Assignment Management 📝</h1>

          <p>
            View and manage assignments in CampusIQ.
          </p>
        </div>

        <button onClick={fetchAssignments}>
          🔄 Refresh
        </button>
      </div>

      {/* ================= SUMMARY ================= */}

      <div className="admin-summary-card">
        <h2>Total Assignments</h2>

        <strong>{assignments.length}</strong>

        <span>
          Registered assignments
        </span>
      </div>

      {/* ================= ASSIGNMENTS LIST ================= */}

      <div className="admin-table-card">

        <div className="admin-table-header">

          <div>
            <h2>Assignments List</h2>

            <p>
              Showing {filteredAssignments.length} of{" "}
              {assignments.length} assignments
            </p>
          </div>

          <input
            type="text"
            placeholder="🔍 Search assignments..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="admin-message">
            Loading assignments...
          </div>
        )}

        {/* ================= ERROR ================= */}

        {!loading && error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {/* ================= TABLE ================= */}

        {!loading &&
          !error &&
          filteredAssignments.length > 0 && (
            <div className="table-container">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Faculty</th>
                    <th>Assigned Date</th>
                    <th>Due Date</th>
                    <th>Max Marks</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredAssignments.map(
                    (assignment) => (
                      <tr key={assignment.id}>

                        <td>
                          {assignment.id}
                        </td>

                        <td>
                          <strong>
                            {assignment.title || "-"}
                          </strong>
                        </td>

                        <td>
                          {assignment.subject_name || "-"}
                        </td>

                        <td>
                          {assignment.faculty_name || "-"}
                        </td>

                        <td>
                          {assignment.assigned_date
                            ? new Date(
                                assignment.assigned_date
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td>
                          {assignment.due_date
                            ? new Date(
                                assignment.due_date
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td>
                          {assignment.max_marks ?? "-"}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        {/* ================= NO DATA ================= */}

        {!loading &&
          !error &&
          filteredAssignments.length === 0 && (
            <div className="admin-message">
              No assignments found.
            </div>
          )}

      </div>

    </div>
  );
}

export default AdminAssignments;