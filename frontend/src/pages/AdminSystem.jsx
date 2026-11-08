import { useEffect, useState } from "react";

function AdminSystem() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [databaseStatus, setDatabaseStatus] = useState("Checking...");
  const [aiStatus, setAiStatus] = useState("Checking...");
  const [checking, setChecking] = useState(false);

  const checkSystemStatus = async () => {
    setChecking(true);

    setBackendStatus("Checking...");
    setDatabaseStatus("Checking...");
    setAiStatus("Checking...");

    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // =====================================================
    // BACKEND API CHECK
    // =====================================================

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/"
      );

      if (response.ok) {
        setBackendStatus("Online");
      } else {
        setBackendStatus("Offline");
      }
    } catch (error) {
      console.error("Backend status error:", error);
      setBackendStatus("Offline");
    }

    // =====================================================
    // DATABASE CHECK
    // =====================================================

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/admin/stats",
        {
          method: "GET",
          headers,
        }
      );

      if (response.ok) {
        setDatabaseStatus("Connected");
      } else {
        setDatabaseStatus("Unavailable");
      }
    } catch (error) {
      console.error("Database status error:", error);
      setDatabaseStatus("Unavailable");
    }

    // =====================================================
    // AI / RAG CHECK
    // =====================================================

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/rag/search",
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            question: "test",
            top_k: 3,
          }),
        }
      );

      if (response.ok) {
        setAiStatus("Online");
      } else {
        setAiStatus("Unavailable");
      }
    } catch (error) {
      console.error("AI status error:", error);
      setAiStatus("Unavailable");
    }

    setChecking(false);
  };

  // =====================================================
  // INITIAL STATUS CHECK
  // =====================================================

  useEffect(() => {
    checkSystemStatus();
  }, []);

  return (
    <div className="admin-system-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="admin-system-header">

        <div className="admin-system-title">

          <h1>
            System Settings ⚙️
          </h1>

          <p>
            Monitor CampusIQ system components and service
            status.
          </p>

        </div>

        <button
          className="admin-system-check-btn"
          onClick={checkSystemStatus}
          disabled={checking}
        >
          {checking
            ? "🔄 Checking..."
            : "🔄 Check Status"}
        </button>

      </div>


      {/* =================================================
          SYSTEM STATUS
          ================================================= */}

      <section className="admin-system-section">

        <div className="admin-system-section-header">

          <h2>
            System Status
          </h2>

          <p>
            Current status of CampusIQ services.
          </p>

        </div>


        <div className="admin-system-status-grid">

          {/* BACKEND */}

          <div className="admin-system-status-card">

            <div className="admin-system-status-top">

              <div className="admin-system-status-icon">
                💻
              </div>

              <div className="admin-system-status-info">

                <h3>
                  Backend API
                </h3>

                <p>
                  FastAPI backend service
                </p>

              </div>

            </div>


            <div className="admin-system-status-state">

              <span
                className={`admin-status-dot ${
                  backendStatus === "Online"
                    ? "admin-status-online"
                    : "admin-status-offline"
                }`}
              ></span>

              {backendStatus}

            </div>

          </div>


          {/* DATABASE */}

          <div className="admin-system-status-card">

            <div className="admin-system-status-top">

              <div className="admin-system-status-icon">
                🗄️
              </div>

              <div className="admin-system-status-info">

                <h3>
                  Database
                </h3>

                <p>
                  MySQL database connection
                </p>

              </div>

            </div>


            <div className="admin-system-status-state">

              <span
                className={`admin-status-dot ${
                  databaseStatus === "Connected"
                    ? "admin-status-connected"
                    : "admin-status-offline"
                }`}
              ></span>

              {databaseStatus}

            </div>

          </div>


          {/* AI */}

          <div className="admin-system-status-card">

            <div className="admin-system-status-top">

              <div className="admin-system-status-icon">
                🤖
              </div>

              <div className="admin-system-status-info">

                <h3>
                  AI Assistant
                </h3>

                <p>
                  RAG and AI service
                </p>

              </div>

            </div>


            <div className="admin-system-status-state">

              <span
                className={`admin-status-dot ${
                  aiStatus === "Online"
                    ? "admin-status-online"
                    : "admin-status-offline"
                }`}
              ></span>

              {aiStatus}

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          TECHNOLOGY STACK
          ================================================= */}

      <section className="admin-system-section">

        <div className="admin-system-section-header">

          <h2>
            CampusIQ Technology Stack
          </h2>

          <p>
            Technologies and frameworks used in the platform.
          </p>

        </div>


        <div className="admin-tech-grid">

          <div className="admin-tech-card">
            <h3>Frontend</h3>
            <p>React.js</p>
          </div>

          <div className="admin-tech-card">
            <h3>Backend</h3>
            <p>Python + FastAPI</p>
          </div>

          <div className="admin-tech-card">
            <h3>Database</h3>
            <p>MySQL</p>
          </div>

          <div className="admin-tech-card">
            <h3>Analytics</h3>
            <p>Pandas + NumPy</p>
          </div>

          <div className="admin-tech-card">
            <h3>Machine Learning</h3>
            <p>Scikit-learn</p>
          </div>

          <div className="admin-tech-card">
            <h3>AI</h3>
            <p>Ollama + Qwen</p>
          </div>

          <div className="admin-tech-card">
            <h3>RAG</h3>
            <p>FAISS + Embeddings</p>
          </div>

          <div className="admin-tech-card">
            <h3>Authentication</h3>
            <p>JWT + RBAC</p>
          </div>

        </div>

      </section>


      {/* =================================================
          ABOUT CAMPUSIQ
          ================================================= */}

      <section className="admin-system-section">

        <div className="admin-about-card">

          <h2>
            About CampusIQ
          </h2>

          <p>
            CampusIQ is an AI-Powered Student Assistance &
            Campus Analytics Platform designed to connect
            students, faculty and administrators through a
            unified academic management system.
          </p>


          <div className="admin-about-details">

            <div className="admin-about-item">

              <span>
                Platform
              </span>

              <strong>
                CampusIQ
              </strong>

            </div>


            <div className="admin-about-item">

              <span>
                Version
              </span>

              <strong>
                1.0.0
              </strong>

            </div>


            <div className="admin-about-item">

              <span>
                Environment
              </span>

              <strong>
                Development
              </strong>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default AdminSystem;