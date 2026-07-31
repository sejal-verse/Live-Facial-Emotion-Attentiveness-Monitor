import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 px-4">

      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg">

        <h1 className="text-4xl font-bold text-center text-blue-700 mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Join AI Smart Classroom
        </p>

        <form className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Roll Number / Employee ID"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Select Role</option>
            <option>Student</option>
            <option>Teacher</option>
          </select>

          <div className="flex border rounded-lg overflow-hidden">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 focus:outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-4 bg-gray-100 hover:bg-gray-200"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="button"
            className="w-full border-2 border-dashed border-blue-500 py-3 rounded-lg text-blue-600 hover:bg-blue-50"
          >
            📷 Register Face (Coming Soon)
          </button>

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Create Account
          </button>

        </form>

        <p className="text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;