import { useEffect, useState } from "react";

function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/notices/",
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
          `Unable to load notices. Status: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("NOTICES API RESPONSE:", data);

      if (Array.isArray(data)) {
        setNotices(data);
      } else if (Array.isArray(data.notices)) {
        setNotices(data.notices);
      } else if (Array.isArray(data.data)) {
        setNotices(data.data);
      } else {
        setNotices([]);
      }
    } catch (err) {
      console.error("NOTICES ERROR:", err);

      setError(
        err?.message ||
          "Something went wrong while loading notices."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notices-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Campus Notices 📢</h1>
          <p>
            Stay updated with the latest college announcements.
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="notices-message">
          Loading notices...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="notices-error">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && notices.length === 0 && (
        <div className="notices-message">
          No notices available.
        </div>
      )}

      {/* Notices */}
      {!loading && !error && notices.length > 0 && (
        <div className="notices-list">

          {notices.map((notice, index) => (
            <div
              className="notice-card"
              key={notice.id || index}
            >

              <div className="notice-icon">
                📢
              </div>

              <div className="notice-content">

                <div className="notice-top">
                  <h2>
                    {notice.title ||
                      notice.notice_title ||
                      "Campus Notice"}
                  </h2>

                  {notice.is_important && (
                    <span className="important-badge">
                      Important
                    </span>
                  )}
                </div>

                <p className="notice-description">
                  {notice.description ||
                    notice.content ||
                    notice.message ||
                    "No description available."}
                </p>

                <div className="notice-meta">

                  <span>
                    📅{" "}
                    {notice.notice_date ||
                      notice.date ||
                      notice.created_at ||
                      "-"}
                  </span>

                  {notice.department && (
                    <span>
                      🏫 {notice.department}
                    </span>
                  )}

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Notices;