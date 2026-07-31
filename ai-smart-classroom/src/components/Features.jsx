import {
  FaUserCheck,
  FaSmile,
  FaBrain,
  FaMobileAlt,
  FaChartLine,
  FaQuestionCircle,
  FaBell,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaFilePdf,
  FaRobot,
} from "react-icons/fa";

const features = [
  {
    icon: <FaUserCheck />,
    title: "AI Face Authentication",
    desc: "Automatic attendance using facial recognition.",
  },
  {
    icon: <FaSmile />,
    title: "Emotion Recognition",
    desc: "Detects student emotions in real-time.",
  },
  {
    icon: <FaBrain />,
    title: "Attention Prediction",
    desc: "Predicts student attention level.",
  },
  {
    icon: <FaMobileAlt />,
    title: "Distraction Detection",
    desc: "Detects phone usage and sleeping.",
  },
  {
    icon: <FaChartLine />,
    title: "Lecture Analytics",
    desc: "Analyzes lecture engagement.",
  },
  {
    icon: <FaQuestionCircle />,
    title: "Confusion Detection",
    desc: "Finds difficult lecture moments.",
  },
  {
    icon: <FaBell />,
    title: "Adaptive Alerts",
    desc: "Popup and voice reminders.",
  },
  {
    icon: <FaChalkboardTeacher />,
    title: "Teacher Dashboard",
    desc: "Live monitoring dashboard.",
  },
  {
    icon: <FaUserGraduate />,
    title: "Student Dashboard",
    desc: "Attendance and performance.",
  },
  {
    icon: <FaFilePdf />,
    title: "AI Reports",
    desc: "Generate PDF & Excel reports.",
  },
  {
    icon: <FaRobot />,
    title: "AI Teacher Assistant",
    desc: "Suggests teaching improvements.",
  },
];

function Features() {
  return (
    <section className="py-24 bg-gray-100">
      <h2 className="text-5xl font-bold text-center text-blue-700 mb-14">
        AI Features
      </h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-8">

        {features.map((feature, index) => (

          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-8 hover:scale-105 transition duration-300"
          >

            <div className="text-5xl text-blue-600 mb-5">
              {feature.icon}
            </div>

            <h3 className="text-2xl font-bold mb-3">
              {feature.title}
            </h3>

            <p className="text-gray-600">
              {feature.desc}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Features;