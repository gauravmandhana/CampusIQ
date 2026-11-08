
import { useState } from "react";

import RoleDashboard from "./pages/RoleDashboard";

import Notes from "./pages/Notes";
import Assignments from "./pages/Assignments";
import Attendance from "./pages/Attendance";
import Marks from "./pages/Marks";
import Timetable from "./pages/Timetable";
import Exams from "./pages/Exams";
import Notices from "./pages/Notices";
import Events from "./pages/Events";
import Faculty from "./pages/Faculty";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import SupportIndicator from "./pages/SupportIndicator";

import AdminStudents from "./pages/AdminStudents";
import AdminFaculty from "./pages/AdminFaculty";
import AdminSubjects from "./pages/AdminSubjects";
import AdminAssignments from "./pages/AdminAssignments";
import AdminNotices from "./pages/AdminNotices";
import AdminSystem from "./pages/AdminSystem";

import Login from "./pages/Login";


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [role, setRole] = useState(
    localStorage.getItem("role") || ""
  );

  const [activePage, setActivePage] = useState("dashboard");


  // LOGIN
  const handleLogin = (userRole) => {
    setIsLoggedIn(true);
    setRole(userRole);
    setActivePage("dashboard");
  };


  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    setIsLoggedIn(false);
    setRole("");
    setActivePage("dashboard");
  };


  // LOGIN PAGE
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }


  return (

    <div className="app">

      {/* NAVBAR */}

      <header className="navbar">

        <div>
          <h1>CampusIQ</h1>
          <span>AI-Powered Student Platform</span>
        </div>

        <div className="nav-links">

          <button
            onClick={() => setActivePage("dashboard")}
            className={
              activePage === "dashboard" ? "active-nav" : ""
            }
          >
            Dashboard
          </button>


          {role === "student" && (
            <button
              onClick={() => setActivePage("ai")}
              className={
                activePage === "ai" ? "active-nav" : ""
              }
            >
              🤖 AI Assistant
            </button>
          )}


          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </header>


      {/* MAIN CONTENT */}

      <main>

        {/* COMMON ROLE DASHBOARD */}

        {activePage === "dashboard" && (
          <RoleDashboard
            role={role}
            setActivePage={setActivePage}
          />
        )}


        {/* STUDENT PAGES */}

        {role === "student" && (
          <>

            {activePage === "notes" && (
              <Notes />
            )}

            {activePage === "assignments" && (
              <Assignments />
            )}

            {activePage === "attendance" && (
              <Attendance />
            )}

            {activePage === "marks" && (
              <Marks />
            )}

            {activePage === "timetable" && (
              <Timetable />
            )}

            {activePage === "exams" && (
              <Exams />
            )}

            {activePage === "notices" && (
              <Notices />
            )}

            {activePage === "events" && (
              <Events />
            )}

            {activePage === "faculty" && (
              <Faculty />
            )}

            {activePage === "profile" && (
              <Profile />
            )}

            {activePage === "analytics" && (
              <Analytics />
            )}

            {activePage === "support" && (
              <SupportIndicator />
            )}

            {activePage === "ai" && (
              <AIAssistant />
            )}

          </>
        )}


        {/* FACULTY PAGES */}

        {role === "faculty" && (
          <>

            {activePage === "notes" && (
              <Notes />
            )}

            {activePage === "assignments" && (
              <Assignments />
            )}

            {activePage === "attendance" && (
              <Attendance />
            )}

            {activePage === "marks" && (
              <Marks />
            )}

          </>
        )}


        {/* ADMIN PAGES */}

        {role === "admin" && (
          <>

            {activePage === "admin-students" && (
              <AdminStudents />
            )}

            {activePage === "admin-faculty" && (
              <AdminFaculty />
            )}

            {activePage === "admin-subjects" && (
              <AdminSubjects />
            )}

            {activePage === "admin-assignments" && (
              <AdminAssignments />
            )}

            {activePage === "admin-notices" && (
              <AdminNotices />
            )}

            {activePage === "admin-system" && (
              <AdminSystem />
            )}

          </>
        )}

      </main>

    </div>

  );
}


/* =====================================================
   AI ASSISTANT
===================================================== */

function AIAssistant() {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // ASK AI

  const askAI = async () => {

    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    setLoading(true);
    setAnswer("");
    setSources([]);
    setError("");

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://127.0.0.1:8000/ai/ask",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },

          body: JSON.stringify({
            question: question.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Something went wrong."
        );
      }

      setAnswer(data.answer || "");
      setSources(data.sources || []);

    } catch (err) {

      console.error("AI ERROR:", err);

      setError(
        "Unable to connect with CampusIQ AI. Make sure FastAPI and Ollama are running."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="ai-page">

      <section className="hero">

        <h2>
          CampusIQ AI Assistant 🤖
        </h2>

        <p>
          Ask questions from your college study material
          using AI + RAG.
        </p>

      </section>


      <section className="chat-card">

        <label htmlFor="question">
          Ask your question
        </label>

        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Example: What is Caesar Cipher?"
          rows="5"
        />

        <button
          onClick={askAI}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask CampusIQ AI"}
        </button>


        {error && (
          <div className="error">
            {error}
          </div>
        )}


        {answer && (
          <div className="answer-section">

            <h3>AI Answer</h3>

            <div className="answer">
              {answer}
            </div>


            {sources.length > 0 && (
              <div className="sources">

                <h3>Sources Used</h3>

                {sources.map((source, index) => (
                  <div
                    className="source"
                    key={index}
                  >

                    <strong>
                      Source {index + 1}
                    </strong>

                    <p>{source}</p>

                  </div>
                ))}

              </div>
            )}

          </div>
        )}

      </section>

    </div>

  );

}


export default App;
