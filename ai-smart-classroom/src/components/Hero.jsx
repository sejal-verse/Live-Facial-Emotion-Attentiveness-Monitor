import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100">

      <div className="text-center">

        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl font-bold text-blue-700"
        >
          AI Smart Classroom
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl mt-6 text-gray-600 max-w-3xl"
        >
          Face Authentication • Emotion Detection • Attention Prediction •
          Smart Analytics • Adaptive Learning
        </motion.p>

        <div className="mt-10 flex justify-center gap-6">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-xl">
            Get Started
          </button>

          <button className="border px-8 py-4 rounded-xl">
            Watch Demo
          </button>
        </div>

      </div>

    </section>
  );
}

export default Hero;