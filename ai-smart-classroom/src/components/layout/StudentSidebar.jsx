import {
  FaHome,
  FaBrain,
  FaChartBar,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { Link } from "react-router-dom";

function StudentSidebar() {
  return (
    <div className="w-64 min-h-screen bg-blue-700 text-white p-6">

      <h1 className="text-3xl font-bold mb-10">
        🤖 AI Classroom
      </h1>

      <nav className="space-y-4">

        <Link
          to="/student"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-600"
        >
          <FaHome />
          Dashboard
        </Link>

        <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-600 w-full text-left">
          <FaBrain />
          Emotion
        </button>

        <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-600 w-full text-left">
          <FaChartBar />
          Analytics
        </button>

        <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-600 w-full text-left">
          <FaCalendarAlt />
          Schedule
        </button>

        <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-600 w-full text-left">
          <FaCog />
          Settings
        </button>

        <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500 w-full text-left mt-10">
          <FaSignOutAlt />
          Logout
        </button>

      </nav>

    </div>
  );
}

export default StudentSidebar;