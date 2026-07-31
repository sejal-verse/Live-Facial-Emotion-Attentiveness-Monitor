import { FaCamera, FaBrain, FaChartBar, FaFileAlt } from "react-icons/fa";

function HowItWorks() {
  const steps = [
    {
      icon: <FaCamera />,
      title: "Face Detection",
      desc: "AI detects every student's face using the webcam.",
    },
    {
      icon: <FaBrain />,
      title: "Emotion Analysis",
      desc: "AI predicts emotions like Happy, Sad, Confused and Neutral.",
    },
    {
      icon: <FaChartBar />,
      title: "Attention Monitoring",
      desc: "System continuously measures attentiveness during the lecture.",
    },
    {
      icon: <FaFileAlt />,
      title: "Generate Reports",
      desc: "Attendance, emotions and engagement reports are generated instantly.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <h2 className="text-5xl font-bold text-center text-blue-700 mb-16">
        How It Works
      </h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-blue-50 rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition duration-300"
          >
            <div className="text-5xl text-blue-600 mb-5 flex justify-center">
              {step.icon}
            </div>

            <h3 className="text-2xl font-bold mb-3">
              {step.title}
            </h3>

            <p className="text-gray-600">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;