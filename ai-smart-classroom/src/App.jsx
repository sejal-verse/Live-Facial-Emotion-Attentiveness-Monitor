import { BrowserRouter, Routes, Route } from "react-router-dom";

// Role Selection
import RoleSelection from "./pages/RoleSelection";

// Teacher Login
import Login from "./pages/login/login";

// Student Login
import StudentLogin from "./pages/login/StudentLogin";

// Teacher Dashboard
import Dashboard from "./pages/Dashboard";

// Student Dashboard
import StudentDashboard from "./pages/StudentDashboard";

// Student Registration
import StudentRegistration from "./pages/StudentRegistration";

// Teacher Pages
import Attendance from "./pages/Attendance";
import Monitoring from "./pages/Monitoring";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ============================= */}
        {/* ROLE SELECTION - FIRST PAGE */}
        {/* ============================= */}

        <Route
          path="/"
          element={<RoleSelection />}
        />

        {/* ============================= */}
        {/* TEACHER LOGIN */}
        {/* ============================= */}

        <Route
          path="/teacher-login"
          element={<Login />}
        />

        {/* Keep old login URL working */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* ============================= */}
        {/* STUDENT LOGIN */}
        {/* ============================= */}

        <Route
          path="/student-login"
          element={<StudentLogin />}
        />

        {/* ============================= */}
        {/* TEACHER DASHBOARD */}
        {/* ============================= */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* ============================= */}
        {/* STUDENT DASHBOARD */}
        {/* ============================= */}

        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />

        {/* ============================= */}
        {/* STUDENT REGISTRATION */}
        {/* ============================= */}

        <Route
          path="/students"
          element={<StudentRegistration />}
        />

        {/* ============================= */}
        {/* TEACHER - SMART ATTENDANCE */}
        {/* ============================= */}

        <Route
          path="/attendance"
          element={<Attendance />}
        />

        {/* ============================= */}
        {/* TEACHER - LIVE MONITORING */}
        {/* ============================= */}

        <Route
          path="/monitoring"
          element={<Monitoring />}
        />

        {/* ============================= */}
        {/* TEACHER - ANALYTICS */}
        {/* ============================= */}

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        {/* ============================= */}
        {/* TEACHER - AI REPORTS */}
        {/* ============================= */}

        <Route
          path="/reports"
          element={<Reports />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;