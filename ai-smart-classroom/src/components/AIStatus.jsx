import {
  FaUserCheck,
  FaSmile,
  FaBrain,
  FaClock,
  FaVideo,
} from "react-icons/fa";

function AIStatus() {
  return (
    <div className="space-y-5">

      <div className="bg-white rounded-xl shadow-lg p-5">
        <div className="flex items-center gap-3">
          <FaVideo className="text-green-600 text-3xl" />
          <div>
            <h3 className="font-bold">Camera Status</h3>
            <p className="text-green-600">Live 🟢</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-5">
        <div className="flex items-center gap-3">
          <FaUserCheck className="text-green-600 text-3xl" />
          <div>
            <h3 className="font-bold">Face Verification</h3>
            <p className="text-green-600">Verified ✅</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-5">
        <div className="flex items-center gap-3">
          <FaSmile className="text-yellow-500 text-3xl" />
          <div>
            <h3 className="font-bold">Current Emotion</h3>
            <p>😊 Happy</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-5">
        <div className="flex items-center gap-3">
          <FaBrain className="text-blue-600 text-3xl" />
          <div>
            <h3 className="font-bold">Attention Level</h3>
            <p>92%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-5">
        <div className="flex items-center gap-3">
          <FaClock className="text-purple-600 text-3xl" />
          <div>
            <h3 className="font-bold">Session Time</h3>
            <p>00:18:42</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AIStatus;