import { useEffect, useState } from "react";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/events/",
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
          `Unable to load events. Status: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("EVENTS API RESPONSE:", data);

      if (Array.isArray(data)) {
        setEvents(data);
      } else if (Array.isArray(data.events)) {
        setEvents(data.events);
      } else if (Array.isArray(data.data)) {
        setEvents(data.data);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("EVENTS ERROR:", err);

      setError(
        err?.message ||
          "Something went wrong while loading events."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="events-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Campus Events 🎉</h1>
          <p>
            Discover upcoming college events and activities.
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="events-message">
          Loading events...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="events-error">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && events.length === 0 && (
        <div className="events-message">
          No events available.
        </div>
      )}

      {/* Events */}
      {!loading && !error && events.length > 0 && (
        <div className="events-grid">

          {events.map((event, index) => (
            <div
              className="event-card"
              key={event.id || index}
            >

              <div className="event-icon">
                🎉
              </div>

              <div className="event-content">

                <div className="event-top">
                  <h2>
                    {event.title ||
                      event.event_name ||
                      event.name ||
                      "Campus Event"}
                  </h2>

                  <span className="event-number">
                    #{index + 1}
                  </span>
                </div>

                <p className="event-description">
                  {event.description ||
                    event.details ||
                    event.content ||
                    "No description available."}
                </p>

                <div className="event-info">

                  <div className="event-info-item">
                    <span>📅 Date</span>
                    <strong>
                      {event.event_date ||
                        event.date ||
                        "-"}
                    </strong>
                  </div>

                  <div className="event-info-item">
                    <span>⏰ Time</span>
                    <strong>
                      {event.start_time &&
                      event.end_time
                        ? `${event.start_time} - ${event.end_time}`
                        : event.time ||
                          event.time_slot ||
                          "-"}
                    </strong>
                  </div>

                  <div className="event-info-item">
                    <span>📍 Venue</span>
                    <strong>
                      {event.venue ||
                        event.location ||
                        "-"}
                    </strong>
                  </div>

                </div>

                {event.organizer && (
                  <div className="event-organizer">
                    👤 Organizer:{" "}
                    <strong>{event.organizer}</strong>
                  </div>
                )}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Events;