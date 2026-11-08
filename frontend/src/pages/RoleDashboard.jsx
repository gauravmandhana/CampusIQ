
import Dashboard from "./Dashboard";
import FacultyDashboard from "./FacultyDashboard";
import AdminDashboard from "./AdminDashboard";

function RoleDashboard({ role, setActivePage }) {

  // STUDENT
  if (role === "student") {
    return (
      <Dashboard
        setActivePage={setActivePage}
      />
    );
  }

  // FACULTY
  if (role === "faculty") {
    return (
      <FacultyDashboard
        setActivePage={setActivePage}
      />
    );
  }

  // ADMIN
  if (role === "admin") {
    return (
      <AdminDashboard
        setActivePage={setActivePage}
      />
    );
  }

  // UNKNOWN ROLE
  return (
    <div className="dashboard">
      <div className="dashboard-card">
        <h2>Access Error</h2>
        <p>
          Unknown user role. Please contact
          the system administrator.
        </p>
      </div>
    </div>
  );
}

export default RoleDashboard;
