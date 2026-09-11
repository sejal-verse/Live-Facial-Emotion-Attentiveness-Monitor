import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import TeacherDashboard from "./pages/TeacherDashboard";
import Attendance from "./pages/Attendance";
import Monitoring from "./pages/Monitoring";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import StudentRegistration from "./pages/StudentRegistration";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Teacher Dashboard */}
        <Route
          path="/"
          element={<TeacherDashboard />}
        />

        {/* Attendance */}
        <Route
          path="/attendance"
          element={<Attendance />}
        />

        {/* Live Monitoring */}
        <Route
          path="/monitoring"
          element={<Monitoring />}
        />

        {/* Analytics */}
        <Route
          path="/analytics"
          element={<Analytics />}
        />

        {/* AI Reports */}
        <Route
          path="/reports"
          element={<Reports />}
        />

        {/* Student Registration */}
        <Route
          path="/students"
          element={<StudentRegistration />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;