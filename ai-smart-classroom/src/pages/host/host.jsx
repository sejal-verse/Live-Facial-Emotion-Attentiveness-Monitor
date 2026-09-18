import { useNavigate } from "react-router-dom";

function Host() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-4">

      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg text-center">

        <div className="text-6xl mb-5">
          👨‍🏫
        </div>

        <h1 className="text-4xl font-bold text-blue-700 mb-3">
          Teacher Portal
        </h1>

        <p className="text-gray-500 mb-8">
          Welcome to AI Smart Classroom
        </p>

        <div className="bg-blue-50 rounded-xl p-5 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Teacher Dashboard
          </h2>

          <p className="text-gray-500">
            Monitor attendance, student attention, emotions,
            distractions and classroom performance using AI.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Enter Teacher Dashboard
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 border border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          Back to Login
        </button>

      </div>

    </div>
  );
}

export default Host;