import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function TeacherDashboard() {

  const [liveData, setLiveData] = useState({
    monitoring: false,
    studentsPresent: 0,
    averageAttention: 0,
    mainEmotion: "Not Monitoring",
    distractedCount: 0,
  });

  // Read live monitoring data
  useEffect(() => {

    const loadLiveData = () => {

      const data = JSON.parse(
        localStorage.getItem("liveMonitoringData") || "null"
      );

      if (data) {
        setLiveData(data);
      }

    };

    loadLiveData();

    // Update dashboard every second
    const interval = setInterval(
      loadLiveData,
      1000
    );

    return () => clearInterval(interval);

  }, []);

  return (

    <div className="page-container">

      {/* Header */}
      <div className="dashboard-header">

        <div>
          <h1>Teacher Dashboard</h1>

          <p>
            Welcome to your AI-powered classroom
            monitoring system.
          </p>
        </div>

        <Link
          to="/monitoring"
          className="monitor-button"
        >
          {liveData.monitoring
            ? "View Live Monitoring"
            : "Start Monitoring"}
        </Link>

      </div>


      {/* Live Status */}
      <div className="ai-monitor-status">

        <div className="monitor-header">

          <div>
            <h2>Live Classroom Status</h2>

            <p>
              Real-time data from classroom monitoring
            </p>
          </div>

          <span
            className={`monitor-status ${
              liveData.monitoring
                ? "active"
                : ""
            }`}
          >
            {liveData.monitoring
              ? "🟢 Monitoring Active"
              : "⚪ Monitoring Inactive"}
          </span>

        </div>


        {/* Main Cards */}
        <div className="dashboard-stats-grid">

          {/* Students */}
          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon">
              👥
            </div>

            <div>
              <span>
                Students Present
              </span>

              <h2>
                {liveData.studentsPresent}
              </h2>

              <small>
                Currently detected
              </small>
            </div>

          </div>


          {/* Attention */}
          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon">
              🎯
            </div>

            <div>
              <span>
                Average Attention
              </span>

              <h2>
                {liveData.averageAttention}%
              </h2>

              <small>
                Classroom attention
              </small>
            </div>

          </div>


          {/* Emotion */}
          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon">
              😊
            </div>

            <div>
              <span>
                Main Emotion
              </span>

              <h2>
                {liveData.mainEmotion}
              </h2>

              <small>
                Most detected emotion
              </small>
            </div>

          </div>


          {/* Distracted */}
          <div className="dashboard-stat-card">

            <div className="dashboard-stat-icon">
              ⚠️
            </div>

            <div>
              <span>
                Distracted
              </span>

              <h2 className="status-danger">
                {liveData.distractedCount}
              </h2>

              <small>
                Students requiring attention
              </small>
            </div>

          </div>

        </div>

      </div>


      {/* Quick Actions */}
      <div className="ai-monitor-status">

        <h2>Quick Actions</h2>

        <div className="quick-actions">

          <Link
            to="/monitoring"
            className="quick-action-card"
          >
            <span>📹</span>

            <div>
              <h3>Live Monitoring</h3>
              <p>
                Monitor students in real time
              </p>
            </div>
          </Link>


          <Link
            to="/attendance"
            className="quick-action-card"
          >
            <span>📋</span>

            <div>
              <h3>Attendance</h3>
              <p>
                View classroom attendance
              </p>
            </div>
          </Link>


          <Link
            to="/analytics"
            className="quick-action-card"
          >
            <span>📊</span>

            <div>
              <h3>Analytics</h3>
              <p>
                Analyze classroom performance
              </p>
            </div>
          </Link>


          <Link
            to="/reports"
            className="quick-action-card"
          >
            <span>📄</span>

            <div>
              <h3>AI Reports</h3>
              <p>
                View generated classroom reports
              </p>
            </div>
          </Link>

        </div>

      </div>


      {/* System Features */}
      <div className="ai-monitor-status">

        <h2>AI Classroom Features</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <span>👥</span>
            <h3>Smart Attendance</h3>
            <p>
              Automatically detect students
              and record attendance.
            </p>
          </div>


          <div className="feature-card">
            <span>😊</span>
            <h3>Emotion Detection</h3>
            <p>
              Analyze facial expressions
              during the class.
            </p>
          </div>


          <div className="feature-card">
            <span>🎯</span>
            <h3>Attention Monitoring</h3>
            <p>
              Estimate student attention
              using face position and landmarks.
            </p>
          </div>


          <div className="feature-card">
            <span>⚠️</span>
            <h3>Distraction Detection</h3>
            <p>
              Identify students who appear
              distracted.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default TeacherDashboard;