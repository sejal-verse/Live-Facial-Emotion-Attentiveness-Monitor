import {
  FaSmile,
  FaBrain,
  FaCalendarCheck,
  FaBook,
} from "react-icons/fa";

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
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold text-blue-700">
        Student Dashboard
      </h1>

      <p className="text-gray-600 mt-2 mb-8">
        Welcome back! Here's your AI classroom overview.
      </p>

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

    </div>
  );
}

export default Student;