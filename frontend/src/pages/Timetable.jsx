import { useEffect, useState } from "react";

function Timetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/timetable/",
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
          `Unable to load timetable. Status: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("TIMETABLE API RESPONSE:", data);

      // API response normalize
      if (Array.isArray(data)) {
        setTimetable(data);
      } else if (Array.isArray(data.timetable)) {
        setTimetable(data.timetable);
      } else if (Array.isArray(data.data)) {
        setTimetable(data.data);
      } else {
        setTimetable([]);
      }
    } catch (err) {
      console.error("TIMETABLE ERROR:", err);

      setError(
        err?.message ||
          "Something went wrong while loading timetable."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="timetable-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Class Timetable 📅</h1>
          <p>
            View your weekly class schedule.
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="timetable-message">
          Loading timetable...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="timetable-error">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && timetable.length === 0 && (
        <div className="timetable-message">
          No timetable records available.
        </div>
      )}

      {/* Timetable */}
      {!loading && !error && timetable.length > 0 && (
        <div className="timetable-card">

          <div className="timetable-table-wrapper">

            <table className="timetable-table">

              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Subject</th>
                  <th>Faculty</th>
                  <th>Room</th>
                </tr>
              </thead>

              <tbody>
                {timetable.map((item, index) => (
                  <tr key={item.id || index}>

                    <td>
                      <strong>
                        {item.day ||
                          item.day_of_week ||
                          "-"}
                      </strong>
                    </td>

                    <td>
                      {item.time ||
                        item.time_slot ||
                        (
                          item.start_time &&
                          item.end_time
                            ? `${item.start_time} - ${item.end_time}`
                            : "-"
                        )}
                    </td>

                    <td>
                      {item.subject_name ||
                        item.subject ||
                        item.subject_title ||
                        "-"}
                    </td>

                    <td>
                      {item.faculty_name ||
                        item.faculty ||
                        item.teacher ||
                        "-"}
                    </td>

                    <td>
                      {item.room ||
                        item.room_number ||
                        "-"}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
}

export default Timetable;