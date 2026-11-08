import { useEffect, useState } from "react";

function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/admin/notices",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("ADMIN NOTICES:", data);

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to load notices."
        );
      }

      if (Array.isArray(data)) {
        setNotices(data);
      } else {
        setNotices([]);
      }
    } catch (err) {
      console.error("ADMIN NOTICES ERROR:", err);
      setError(err.message || "Unable to load notices.");
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = notices.filter((notice) => {
    const searchText = search.toLowerCase().trim();

    return (
      String(notice.title || "")
        .toLowerCase()
        .includes(searchText) ||
      String(notice.description || "")
        .toLowerCase()
        .includes(searchText) ||
      String(notice.content || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  return (
    <div className="admin-notices-page">

      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1>Notice Management 📢</h1>
          <p>
            View and manage all notices published in CampusIQ.
          </p>
        </div>

        <button onClick={fetchNotices}>
          🔄 Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="admin-summary-card">
        <h2>Total Notices</h2>

        <strong>{notices.length}</strong>

        <span>
          Registered campus notices
        </span>
      </div>

      {/* Notices Table */}
      <div className="admin-table-card">

        <div className="admin-table-header">
          <div>
            <h2>Notices List</h2>

            <p>
              Showing {filteredNotices.length} of{" "}
              {notices.length} notices
            </p>
          </div>

          <input
            type="text"
            placeholder="🔍 Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="admin-message">
            Loading notices...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {/* Table */}
        {!loading &&
          !error &&
          filteredNotices.length > 0 && (
            <div className="table-container">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredNotices.map((notice) => (
                    <tr key={notice.id}>

                      <td>
                        {notice.id}
                      </td>

                      <td>
                        <strong>
                          {notice.title || "-"}
                        </strong>
                      </td>

                      <td>
                        {notice.description ||
                          notice.content ||
                          "-"}
                      </td>

                      <td>
                        {notice.created_at
                          ? new Date(
                              notice.created_at
                            ).toLocaleDateString()
                          : notice.date
                          ? new Date(
                              notice.date
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        {/* No Data */}
        {!loading &&
          !error &&
          filteredNotices.length === 0 && (
            <div className="admin-message">
              {search
                ? "No notices match your search."
                : "No notices found."}
            </div>
          )}

      </div>

    </div>
  );
}

export default AdminNotices;