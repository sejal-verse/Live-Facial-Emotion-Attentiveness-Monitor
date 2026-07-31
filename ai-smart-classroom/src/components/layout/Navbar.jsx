import { Link } from "react-router-dom";
import { FaRobot } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 text-3xl font-bold text-blue-700"
        >
          <FaRobot className="text-4xl" />
          AI Smart Classroom
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-lg font-medium">

          <Link
            to="/"
            className="hover:text-blue-600 transition duration-300"
          >
            Home
          </Link>

          <Link
            to="/classroom"
            className="hover:text-blue-600 transition duration-300"
          >
            Classroom
          </Link>

          <Link
            to="/reports"
            className="hover:text-blue-600 transition duration-300"
          >
            Reports
          </Link>

          <Link
            to="/contact"
            className="hover:text-blue-600 transition duration-300"
          >
            Contact
          </Link>

        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">

          <Link
            to="/login"
            className="border border-blue-600 text-blue-600 px-5 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Get Started
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;