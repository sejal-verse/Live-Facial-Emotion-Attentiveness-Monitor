import {
  FaUserCheck,
  FaSmile,
  FaBrain,
  FaChartLine,
} from "react-icons/fa";

import AttendanceChart from "./charts/AttendanceChart";
import EmotionChart from "./charts/EmotionChart";

function DashboardPreview() {
  const cards = [
    {
      icon: <FaUserCheck />,
      title: "Attendance",
      value: "96%",
      color: "text-green-600",
    },
    {
      icon: <FaSmile />,
      title: "Happy Students",
      value: "88%",
      color: "text-yellow-500",
    },
    {
      icon: <FaBrain />,
      title: "Attention Level",
      value: "91%",
      color: "text-blue-600",
    },
    {
      icon: <FaChartLine />,
      title: "Lecture Score",
      value: "94%",
      color: "text-purple-600",
    },
  ];

  return (
    <section className="py-24 bg-gray-100">
      <h2 className="text-5xl font-bold text-center text-blue-700 mb-14">
        Dashboard Preview
      </h2>

      {/* Dashboard Cards */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300"
          >
            <div className={`text-5xl mb-5 ${card.color}`}>
              {card.icon}
            </div>

            <h3 className="text-2xl font-bold">
              {card.title}
            </h3>

            <p className="text-4xl font-bold text-gray-800 mt-5">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 mt-16 px-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <AttendanceChart />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <EmotionChart />
        </div>
      </div>
    </section>
  );
}

export default DashboardPreview;