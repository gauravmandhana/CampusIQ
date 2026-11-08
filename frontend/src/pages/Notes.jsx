
import { useEffect, useState } from "react";

const BACKEND_URL = "http://127.0.0.1:8000";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  // Fetch notes from backend
  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first to access your notes.");
      }

      const response = await fetch(`${BACKEND_URL}/notes/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        throw new Error(
          `Unable to load notes. Status: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("NOTES API RESPONSE:", data);

      let notesData = [];

      if (Array.isArray(data)) {
        notesData = data;
      } else if (Array.isArray(data.notes)) {
        notesData = data.notes;
      } else if (Array.isArray(data.data)) {
        notesData = data.data;
      }

      setNotes(notesData);
    } catch (err) {
      console.error("NOTES ERROR:", err);
      setError(
        err.message || "Something went wrong while loading notes."
      );
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // Build correct backend file URL
  const getNoteUrl = (note) => {
    let filePath = note.file_url || note.file_path || "";

    if (!filePath) {
      return null;
    }

    filePath = String(filePath).trim().replace(/\\/g, "/");

    // Already a complete URL
    if (/^https?:\/\//i.test(filePath)) {
      return filePath;
    }

    // Find the last uploads/notes section
    const marker = "uploads/notes/";
    const lowerPath = filePath.toLowerCase();
    const markerIndex = lowerPath.lastIndexOf(marker);

    if (markerIndex !== -1) {
      const filename = filePath.substring(
        markerIndex + marker.length
      );

      const safeFilename = filename
        .split("/")
        .map((part) => encodeURIComponent(part))
        .join("/");

      return `${BACKEND_URL}/uploads/notes/${safeFilename}`;
    }

    // Handle other relative paths
    if (!filePath.startsWith("/")) {
      filePath = `/${filePath}`;
    }

    return `${BACKEND_URL}${filePath
      .split("/")
      .map((part, index) =>
        index === 0 ? "" : encodeURIComponent(part)
      )
      .join("/")}`;
  };

  // Open note in a new tab
  const openNote = (note) => {
    const noteUrl = getNoteUrl(note);

    console.log("OPENING NOTE URL:", noteUrl);

    if (!noteUrl) {
      alert("Note file is not available.");
      return;
    }

    window.open(noteUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="notes-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Study Notes 📚</h1>
          <p>Access your semester study material.</p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="notes-message">
          Loading notes...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="notes-error">
          <p>{error}</p>
          <button onClick={fetchNotes}>
            Try Again
          </button>
        </div>
      )}

      {/* Notes List */}
      {!loading && !error && notes.length > 0 && (
        <div className="notes-grid">
          {notes.map((note, index) => (
            <div
              className="note-card"
              key={note.id || index}
            >
              <div className="note-icon">
                📚
              </div>

              <div className="note-content">
                <h2>
                  {note.title || note.name || "Study Note"}
                </h2>

                <p>
                  {note.description ||
                    "Study material uploaded by faculty."}
                </p>

                <button
                  className="view-note-btn"
                  onClick={() => openNote(note)}
                  disabled={!note.file_url && !note.file_path}
                >
                  View Notes →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && notes.length === 0 && (
        <div className="notes-message">
          <h3>No Notes Available</h3>
          <p>
            No study material was found in the database.
          </p>
        </div>
      )}

    </div>
  );
}

export default Notes;
