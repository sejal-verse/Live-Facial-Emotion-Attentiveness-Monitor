import {
  FaSmile,
  FaBrain,
  FaCalendarCheck,
  FaBook,
} from "react-icons/fa";

import StudentSidebar from "../../components/layout/StudentSidebar";
import AttendanceChart from "../../components/charts/AttendanceChart";
import EmotionChart from "../../components/charts/EmotionChart";
import LiveCamera from "../../components/LiveCamera";
import AIStatus from "../../components/AIStatus";

function Student() {
  const stats = [
    {
      title: "Current Emotion",
      value: "😊 Happy",
      icon: <FaSmile />,
      color: "text-yellow-500",
    },
    {
      title: "Attention Level",
      value: "92%",
      icon: <FaBrain />,
      color: "text-blue-600",
    },
    {
      title: "Attendance",
      value: "Present",
      icon: <FaCalendarCheck />,
      color: "text-green-600",
    },
    {
      title: "Today's Classes",
      value: "4",
      icon: <FaBook />,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="flex min-h-screen">

      <StudentSidebar />

      <div className="flex-1 bg-gray-100 p-8">

        {/* Welcome Header */}
        <div className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-4xl font-bold text-blue-700">
              👋 Welcome Back, Student
            </h1>

            <p className="text-gray-600 mt-2">
              AI Smart Classroom Dashboard
            </p>
          </div>

          <img
            src="https://ui-avatars.com/api/?name=Student&background=2563eb&color=fff&size=128"
            alt="Student"
            className="w-16 h-16 rounded-full shadow-lg"
          />

        </div>

        {/* Live AI Monitoring */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">

          <div className="lg:col-span-2">
            <LiveCamera />
          </div>

          <AIStatus />

        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-6">

          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >

              <div className={`text-4xl mb-4 ${item.color}`}>
                {item.icon}
              </div>

              <h3 className="text-lg font-semibold text-gray-700">
                {item.title}
              </h3>

              <p className="text-3xl font-bold mt-3">
                {item.value}
              </p>

            </div>
          ))}

        </div>

        {/* AI Analytics */}
        <div className="mt-14">

          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            📊 AI Analytics
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <h3 className="text-xl font-semibold mb-4">
                Weekly Attention
              </h3>

              <AttendanceChart />

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">

              <h3 className="text-xl font-semibold mb-4">
                Emotion Distribution
              </h3>

              <EmotionChart />

            </div>

          </div>

        </div>

        {/* Today's Schedule */}
        <div className="mt-12">

          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            📅 Today's Schedule
          </h2>

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex justify-between border-b py-3">
              <span>AI Lab</span>
              <span>09:00 AM</span>
            </div>

            <div className="flex justify-between border-b py-3">
              <span>Machine Learning</span>
              <span>11:00 AM</span>
            </div>

            <div className="flex justify-between border-b py-3">
              <span>DBMS</span>
              <span>02:00 PM</span>
            </div>

            <div className="flex justify-between py-3">
              <span>Python Lab</span>
              <span>04:00 PM</span>
            </div>

          </div>

        </div>

        {/* Download Report */}
        <div className="mt-10 flex justify-center">

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl shadow-lg text-lg transition">
            📄 Download AI Report
          </button>

        </div>

        {/* Recent Activity */}
        <div className="mt-14">

          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            📝 Recent Activity
          </h2>

          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold">
                Attendance Marked
              </h3>

              <p className="text-gray-500 text-sm">
                You were marked present today at 8:58 AM.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold">
                Emotion Analysis
              </h3>

              <p className="text-gray-500 text-sm">
                Your dominant emotion was Happy during the AI Lab.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold">
                Attention Score Updated
              </h3>

              <p className="text-gray-500 text-sm">
                Current attention level: 92%.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Student;