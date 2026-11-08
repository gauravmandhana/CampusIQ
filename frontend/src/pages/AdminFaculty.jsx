import { useEffect, useState } from "react";

function AdminFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/admin/faculty",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("ADMIN FACULTY:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to load faculty."
        );
      }

      if (Array.isArray(data)) {
        setFaculty(data);
      } else if (Array.isArray(data.faculty)) {
        setFaculty(data.faculty);
      } else {
        setFaculty([]);
      }

    } catch (err) {
      console.error("ADMIN FACULTY ERROR:", err);

      setError(
        err.message || "Unable to load faculty."
      );

    } finally {
      setLoading(false);
    }
  };


  /* SEARCH FACULTY */

  const filteredFaculty = faculty.filter((member) => {

    const searchText = search
      .toLowerCase()
      .trim();

    if (!searchText) {
      return true;
    }

    return (
      String(member.faculty_id || "")
        .toLowerCase()
        .includes(searchText) ||

      String(member.name || "")
        .toLowerCase()
        .includes(searchText) ||

      String(member.department || "")
        .toLowerCase()
        .includes(searchText) ||

      String(member.designation || "")
        .toLowerCase()
        .includes(searchText) ||

      String(member.email || "")
        .toLowerCase()
        .includes(searchText)
    );
  });


  /* VIEW FACULTY */

  const handleViewFaculty = (member) => {
    setSelectedFaculty(member);
  };


  /* CLOSE MODAL */

  const handleCloseDetails = () => {
    setSelectedFaculty(null);
  };


  return (
    <div className="admin-faculty-page">


      {/* PAGE HEADER */}

      <div className="admin-page-header">

        <div>

          <h1>
            Faculty Management 👨‍🏫
          </h1>

          <p>
            View and manage registered CampusIQ faculty members.
          </p>

        </div>


        <button onClick={fetchFaculty}>
          🔄 Refresh
        </button>

      </div>



      {/* TOTAL FACULTY */}

      <div className="admin-summary-card">

        <h2>
          Total Faculty
        </h2>

        <strong>
          {faculty.length}
        </strong>

        <span>
          Registered faculty members
        </span>

      </div>



      {/* FACULTY TABLE */}

      <div className="admin-table-card">


        <div className="student-list-header">

          <div>

            <h2>
              Faculty List
            </h2>

            <p>
              Showing {filteredFaculty.length} of{" "}
              {faculty.length} faculty members
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
              placeholder="Search faculty..."
            />

          </div>

        </div>



        {/* LOADING */}

        {loading && (
          <div className="admin-message">
            Loading faculty...
          </div>
        )}



        {/* ERROR */}

        {!loading && error && (
          <div className="admin-error">
            {error}
          </div>
        )}



        {/* FACULTY DATA */}

        {!loading && !error && (

          <>

            {filteredFaculty.length === 0 ? (

              <div className="admin-message">

                {search
                  ? "No faculty members match your search."
                  : "No faculty members found."}

              </div>

            ) : (

              <div className="table-container">

                <table className="admin-table">

                  <thead>

                    <tr>

                      <th>
                        ID
                      </th>

                      <th>
                        Faculty ID
                      </th>

                      <th>
                        Name
                      </th>

                      <th>
                        Department
                      </th>

                      <th>
                        Designation
                      </th>

                      <th>
                        Email
                      </th>

                      <th>
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredFaculty.map(
                      (member) => (

                        <tr key={member.id}>

                          <td>
                            {member.id}
                          </td>

                          <td>
                            {member.faculty_id || "-"}
                          </td>

                          <td>
                            {member.name || "-"}
                          </td>

                          <td>
                            {member.department || "-"}
                          </td>

                          <td>
                            {member.designation || "-"}
                          </td>

                          <td>
                            {member.email || "-"}
                          </td>

                          <td>

                            <button
                              className="view-student-btn"
                              onClick={() =>
                                handleViewFaculty(member)
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



      {/* FACULTY DETAILS MODAL */}

      {selectedFaculty && (

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
                  Faculty Details 👨‍🏫
                </h2>

                <p>
                  CampusIQ Faculty Profile
                </p>

              </div>


              <button
                className="modal-close-btn"
                onClick={handleCloseDetails}
              >
                ✕
              </button>

            </div>



            {/* FACULTY PROFILE */}

            <div className="student-profile-box">

              <div className="student-avatar">
                👨‍🏫
              </div>

              <div>

                <h3>
                  {selectedFaculty.name || "Faculty"}
                </h3>

                <span>
                  Faculty ID:{" "}
                  {selectedFaculty.faculty_id || "-"}
                </span>

              </div>

            </div>



            {/* FACULTY DETAILS */}

            <div className="student-details-grid">


              <div className="student-detail-item">

                <span>
                  Faculty ID
                </span>

                <strong>
                  {selectedFaculty.faculty_id || "-"}
                </strong>

              </div>


              <div className="student-detail-item">

                <span>
                  Name
                </span>

                <strong>
                  {selectedFaculty.name || "-"}
                </strong>

              </div>


              <div className="student-detail-item">

                <span>
                  Department
                </span>

                <strong>
                  {selectedFaculty.department || "-"}
                </strong>

              </div>


              <div className="student-detail-item">

                <span>
                  Designation
                </span>

                <strong>
                  {selectedFaculty.designation || "-"}
                </strong>

              </div>


              <div className="student-detail-item">

                <span>
                  Email
                </span>

                <strong>
                  {selectedFaculty.email || "-"}
                </strong>

              </div>


              <div className="student-detail-item">

                <span>
                  Phone
                </span>

                <strong>
                  {selectedFaculty.phone || "-"}
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

export default AdminFaculty;