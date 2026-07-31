import { Link } from "react-router-dom";
import { FaRobot } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-5 shadow-md bg-white sticky top-0 z-50">

      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 text-3xl font-bold text-blue-600"
      >
        <FaRobot />
        AI Smart Classroom
      </Link>

      {/* Menu */}
      <div className="flex gap-10 text-lg font-medium">

        <Link to="/">Home</Link>

        <Link to="/classroom">Classroom</Link>

        <Link to="/reports">Reports</Link>

        <Link to="/contact">Contact</Link>

      </div>

      {/* Buttons */}
      <div className="flex gap-4">

        <Link
          to="/login"
          className="border border-gray-400 px-6 py-2 rounded-lg hover:bg-gray-100"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Get Started
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;