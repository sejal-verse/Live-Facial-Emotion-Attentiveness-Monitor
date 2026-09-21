import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as faceapi from "face-api.js";

function Monitoring() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [monitoring, setMonitoring] = useState(false);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // ==========================================
  // LOAD AI MODELS
  // ==========================================
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");

        await faceapi.nets.faceExpressionNet.loadFromUri("/models");

        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");

        setModelsLoaded(true);

        console.log("All AI models loaded");
      } catch (error) {
        console.error("MODEL LOADING ERROR:", error);

        setError(
          `Unable to load AI models: ${
            error?.message || "Unknown error"
          }`
        );
      }
    };

    loadModels();
  }, []);

  // ==========================================
  // START CAMERA
  // ==========================================
  const startCamera = async () => {
    try {
      setError("");

      if (!modelsLoaded) {
        alert("AI models are still loading. Please wait.");
        return;
      }

      const registeredStudents = JSON.parse(
        localStorage.getItem("registeredStudents") || "[]"
      );

      if (registeredStudents.length === 0) {
        alert(
          "Please register at least one student before starting monitoring."
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      videoRef.current.srcObject = stream;

      streamRef.current = stream;

      setMonitoring(true);

      // Initial live monitoring data
      localStorage.setItem(
        "liveMonitoringData",
        JSON.stringify({
          monitoring: true,
          monitoringActive: true,

          studentsPresent: 0,

          averageAttention: 0,

          mainEmotion: "Waiting",

          distracted: 0,

          distractedCount: 0,

          students: [],

          // IMPORTANT:
          // Used by Student Dashboard
          studentPerformance: [],

          updatedAt: Date.now(),
        })
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to access camera. Please allow camera permission."
      );
    }
  };

  // ==========================================
  // STOP CAMERA
  // ==========================================
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setMonitoring(false);

    setStudents([]);

    // Reset live monitoring data
    localStorage.setItem(
      "liveMonitoringData",
      JSON.stringify({
        monitoring: false,
        monitoringActive: false,

        studentsPresent: 0,

        averageAttention: 0,

        mainEmotion: "Not Monitoring",

        distracted: 0,

        distractedCount: 0,

        students: [],

        // IMPORTANT:
        // Clear Student Dashboard live data
        studentPerformance: [],

        updatedAt: Date.now(),
      })
    );
  };

  // ==========================================
  // CALCULATE ATTENTION
  // ==========================================
  const calculateAttention = (detection, video) => {
    const box = detection.detection.box;

    const faceCenterX =
      box.x + box.width / 2;

    const faceCenterY =
      box.y + box.height / 2;

    const videoCenterX =
      video.videoWidth / 2;

    const videoCenterY =
      video.videoHeight / 2;

    const horizontalDifference =
      Math.abs(faceCenterX - videoCenterX) /
      video.videoWidth;

    const verticalDifference =
      Math.abs(faceCenterY - videoCenterY) /
      video.videoHeight;

    let positionScore;

    if (horizontalDifference < 0.1) {
      positionScore = 100;
    } else if (horizontalDifference < 0.2) {
      positionScore = 85;
    } else if (horizontalDifference < 0.3) {
      positionScore = 65;
    } else {
      positionScore = 40;
    }

    if (verticalDifference > 0.3) {
      positionScore -= 15;
    }

    // Face landmarks
    const landmarks = detection.landmarks;

    const nose = landmarks.getNose();

    const noseX = nose[3].x;

    const noseDifference =
      Math.abs(noseX - videoCenterX) /
      video.videoWidth;

    let landmarkScore;

    if (noseDifference < 0.08) {
      landmarkScore = 100;
    } else if (noseDifference < 0.18) {
      landmarkScore = 85;
    } else if (noseDifference < 0.28) {
      landmarkScore = 65;
    } else {
      landmarkScore = 40;
    }

    let finalScore =
      positionScore * 0.6 +
      landmarkScore * 0.4;

    finalScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(finalScore)
      )
    );

    return finalScore;
  };

  // ==========================================
  // RECOGNIZE REGISTERED STUDENT
  // ==========================================
  const recognizeStudent = async (
    detection,
    registeredStudents
  ) => {
    if (
      !detection.descriptor ||
      registeredStudents.length === 0
    ) {
      return null;
    }

    let bestStudent = null;

    let bestDistance = Infinity;

    for (const student of registeredStudents) {
      if (!student.descriptor) {
        continue;
      }

      const registeredDescriptor =
        new Float32Array(
          student.descriptor
        );

      const distance =
        faceapi.euclideanDistance(
          detection.descriptor,
          registeredDescriptor
        );

      if (distance < bestDistance) {
        bestDistance = distance;

        bestStudent = student;
      }
    }

    // Recognition threshold
    if (
      bestStudent &&
      bestDistance < 0.55
    ) {
      return {
        ...bestStudent,
        distance: bestDistance,
      };
    }

    return null;
  };

  // ==========================================
  // SAVE LIVE DASHBOARD DATA
  // ==========================================
  const saveLiveDashboardData = (studentList) => {
    let averageAttention = 0;

    if (studentList.length > 0) {
      const totalAttention =
        studentList.reduce(
          (sum, student) =>
            sum + student.attentionScore,
          0
        );

      averageAttention =
        Math.round(
          totalAttention /
            studentList.length
        );
    }

    // ==========================================
    // EMOTION COUNT
    // ==========================================
    const emotionCount = {};

    studentList.forEach((student) => {
      const emotion = student.emotion;

      emotionCount[emotion] =
        (emotionCount[emotion] || 0) +
        1;
    });

    let mainEmotion = "None";

    if (
      Object.keys(emotionCount).length > 0
    ) {
      mainEmotion =
        Object.keys(
          emotionCount
        ).reduce((a, b) =>
          emotionCount[a] >
          emotionCount[b]
            ? a
            : b
        );
    }

    // ==========================================
    // DISTRACTED COUNT
    // ==========================================
    const distractedCount =
      studentList.filter(
        (student) =>
          student.distraction ===
          "Distracted"
      ).length;

    // ==========================================
    // IMPORTANT CONNECTION
    // Only recognized students are sent
    // to Student Dashboard
    // ==========================================
    const studentPerformance =
      studentList
        .filter(
          (student) =>
            student.recognized
        )
        .map((student) => ({
          id: student.id,

          name: student.name,

          rollNo: student.rollNo || "",

          attention:
            student.attentionScore,

          attentionScore:
            student.attentionScore,

          attentionStatus:
            student.attentionStatus,

          emotion:
            student.emotion,

          emotionConfidence:
            student.emotionConfidence,

          distraction:
            student.distraction,

          recognized:
            student.recognized,

          attendance:
            student.attendance,
        }));

    // ==========================================
    // COMPLETE DASHBOARD DATA
    // ==========================================
    const dashboardData = {
      monitoring: true,

      monitoringActive: true,

      studentsPresent:
        studentList.filter(
          (student) =>
            student.recognized
        ).length,

      averageAttention:
        averageAttention,

      mainEmotion:
        mainEmotion,

      distracted:
        distractedCount,

      distractedCount:
        distractedCount,

      // Teacher Dashboard
      students:
        studentList,

      // Student Dashboard
      studentPerformance:
        studentPerformance,

      updatedAt:
        Date.now(),
    };

    // Save to localStorage
    localStorage.setItem(
      "liveMonitoringData",
      JSON.stringify(
        dashboardData
      )
    );
  };

  // ==========================================
  // DETECTION LOOP
  // ==========================================
  useEffect(() => {
    let interval;

    if (!monitoring) {
      return;
    }

    interval = setInterval(
      async () => {
        if (
          !videoRef.current ||
          videoRef.current.readyState < 2
        ) {
          return;
        }

        try {
          const registeredStudents =
            JSON.parse(
              localStorage.getItem(
                "registeredStudents"
              ) || "[]"
            );

          const detections =
            await faceapi
              .detectAllFaces(
                videoRef.current,
                new faceapi.TinyFaceDetectorOptions(
                  {
                    inputSize: 320,
                    scoreThreshold: 0.5,
                  }
                )
              )
              .withFaceLandmarks()
              .withFaceExpressions()
              .withFaceDescriptors();

          const studentList = [];

          // ==========================================
          // PROCESS EACH FACE
          // ==========================================
          for (
            let index = 0;
            index < detections.length;
            index++
          ) {
            const detection =
              detections[index];

            // ------------------------------------------
            // RECOGNIZE STUDENT
            // ------------------------------------------
            const recognizedStudent =
              await recognizeStudent(
                detection,
                registeredStudents
              );

            // ------------------------------------------
            // EMOTION
            // ------------------------------------------
            const expressions =
              detection.expressions;

            const emotion =
              Object.keys(
                expressions
              ).reduce(
                (a, b) =>
                  expressions[a] >
                  expressions[b]
                    ? a
                    : b
              );

            const emotionConfidence =
              Math.round(
                expressions[emotion] *
                  100
              );

            // ------------------------------------------
            // ATTENTION
            // ------------------------------------------
            const attentionScore =
              calculateAttention(
                detection,
                videoRef.current
              );

            let attentionStatus;

            if (
              attentionScore >= 80
            ) {
              attentionStatus =
                "High";
            } else if (
              attentionScore >= 60
            ) {
              attentionStatus =
                "Medium";
            } else {
              attentionStatus =
                "Low";
            }

            // ------------------------------------------
            // DISTRACTION
            // ------------------------------------------
            const distraction =
              attentionScore < 60
                ? "Distracted"
                : "Not Distracted";

            // ------------------------------------------
            // STUDENT NAME
            // ------------------------------------------
            const studentName =
              recognizedStudent
                ? recognizedStudent.name
                : `Unknown Student ${
                    index + 1
                  }`;

            // ------------------------------------------
            // STUDENT ID
            // ------------------------------------------
            const studentId =
              recognizedStudent
                ? recognizedStudent.id
                : `unknown-${index + 1}`;

            // ------------------------------------------
            // STUDENT DATA
            // ------------------------------------------
            studentList.push({
              id: studentId,

              name: studentName,

              rollNo:
                recognizedStudent?.rollNo ||
                "",

              recognized:
                recognizedStudent
                  ? true
                  : false,

              emotion:
                emotion,

              emotionConfidence:
                emotionConfidence,

              attentionScore:
                attentionScore,

              attentionStatus:
                attentionStatus,

              distraction:
                distraction,

              attendance:
                recognizedStudent
                  ? "Present"
                  : "Not Recorded",
            });
          }

          // ==========================================
          // UPDATE MONITORING SCREEN
          // ==========================================
          setStudents(studentList);

          // ==========================================
          // SAVE ATTENDANCE
          // ==========================================
          const today =
            new Date()
              .toISOString()
              .split("T")[0];

          const attendanceData =
            JSON.parse(
              localStorage.getItem(
                "classAttendance"
              ) || "{}"
            );

          if (
            !attendanceData[today]
          ) {
            attendanceData[today] = {};
          }

          studentList.forEach(
            (student) => {
              if (
                student.recognized
              ) {
                attendanceData[today][
                  student.name
                ] = "Present";
              }
            }
          );

          localStorage.setItem(
            "classAttendance",
            JSON.stringify(
              attendanceData
            )
          );

          // ==========================================
          // SAVE LIVE DASHBOARD DATA
          // ==========================================
          saveLiveDashboardData(
            studentList
          );

        } catch (error) {
          console.error(
            "Detection error:",
            error
          );
        }
      },
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [monitoring]);

  // ==========================================
  // CLEANUP CAMERA
  // ==========================================
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );
      }
    };
  }, []);

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="page-container">

      {/* ==========================================
          ATTRACTIVE TOP NAVIGATION
      ========================================== */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          height: "74px",
          padding: "0 28px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #172554 50%, #1e1b4b 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          boxShadow:
            "0 8px 25px rgba(15, 23, 42, 0.20)",
          borderBottom:
            "1px solid rgba(255,255,255,0.08)",
          marginBottom: "24px",
        }}
      >

        {/* BRAND */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "11px",
            minWidth: "205px",
          }}
        >

          <div
            style={{
              width: "43px",
              height: "43px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "21px",
              boxShadow:
                "0 6px 18px rgba(59,130,246,0.35)",
            }}
          >
            🤖
          </div>

          <div>
            <div
              style={{
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "800",
                letterSpacing: "0.6px",
                lineHeight: "1.2",
              }}
            >
              AI CLASSROOM
            </div>

            <div
              style={{
                color: "#94a3b8",
                fontSize: "10px",
                marginTop: "3px",
              }}
            >
              Teacher Portal
            </div>
          </div>

        </div>

        {/* NAVIGATION LINKS */}
        <nav
          aria-label="Main navigation"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            flex: 1,
            overflowX: "auto",
          }}
        >

          {/* DASHBOARD */}
          <Link
            to="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 13px",
              borderRadius: "10px",
              color: "#cbd5e1",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: "600",
              whiteSpace: "nowrap",
            }}
          >
            <span>🏠</span>
            <span>Dashboard</span>
          </Link>

          {/* ATTENDANCE */}
          <Link
            to="/attendance"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 13px",
              borderRadius: "10px",
              color: "#cbd5e1",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: "600",
              whiteSpace: "nowrap",
            }}
          >
            <span>📋</span>
            <span>Attendance</span>
          </Link>

          {/* MONITORING - ACTIVE */}
          <Link
            to="/monitoring"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 15px",
              borderRadius: "10px",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: "700",
              whiteSpace: "nowrap",
              background:
                "linear-gradient(135deg, #2563eb, #4f46e5)",
              boxShadow:
                "0 5px 15px rgba(37,99,235,0.35)",
            }}
          >
            <span>👁️</span>
            <span>Monitoring</span>
          </Link>

          {/* ANALYTICS */}
          <Link
            to="/analytics"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 13px",
              borderRadius: "10px",
              color: "#cbd5e1",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: "600",
              whiteSpace: "nowrap",
            }}
          >
            <span>📊</span>
            <span>Analytics</span>
          </Link>

          {/* AI REPORTS */}
          <Link
            to="/reports"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 13px",
              borderRadius: "10px",
              color: "#cbd5e1",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: "600",
              whiteSpace: "nowrap",
            }}
          >
            <span>🤖</span>
            <span>AI Reports</span>
          </Link>

        </nav>

        {/* TEACHER PROFILE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            minWidth: "145px",
            justifyContent: "flex-end",
          }}
        >

          <div
            style={{
              width: "37px",
              height: "37px",
              borderRadius: "50%",
              background: "#334155",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "17px",
              border:
                "2px solid #475569",
            }}
          >
            👨‍🏫
          </div>

          <div>
            <div
              style={{
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              Teacher
            </div>

            <div
              style={{
                color: "#94a3b8",
                fontSize: "9px",
                marginTop: "2px",
              }}
            >
              Administrator
            </div>
          </div>

        </div>

      </header>

      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="monitor-header">

        <div>
          <h1>
            Live Monitoring
          </h1>

          <p>
            Real-time student emotion,
            attention and attendance
            monitoring
          </p>
        </div>

        <span
          className={`monitor-status ${
            monitoring ? "active" : ""
          }`}
        >
          {monitoring
            ? "🟢 Monitoring Active"
            : "⚪ Not Active"}
        </span>

      </div>

      {/* ==========================================
          CAMERA
      ========================================== */}
      <div className="camera-card">

        <div className="card-title">

          <div>
            <h2>
              Classroom Camera
            </h2>

            <p>
              AI-powered classroom
              monitoring
            </p>
          </div>

          {monitoring && (
            <span className="camera-live">
              ● LIVE
            </span>
          )}

        </div>

        <div className="camera-area">

          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="camera-video"
          />

          {!monitoring && (
            <div className="camera-placeholder">

              <div className="camera-icon">
                📷
              </div>

              <h3>
                Camera Not Active
              </h3>

              <p>
                Start monitoring to
                analyze students
              </p>

            </div>
          )}

        </div>

        {error && (
          <div className="camera-error">
            {error}
          </div>
        )}

        <div className="camera-controls">

          {!monitoring ? (
            <button
              className="monitor-button"
              onClick={startCamera}
            >
              ▶ Start Monitoring
            </button>
          ) : (
            <button
              className="stop-button"
              onClick={stopCamera}
            >
              ■ Stop Monitoring
            </button>
          )}

        </div>

      </div>

      {/* ==========================================
          AI STATUS
      ========================================== */}
      <div className="ai-monitor-status">

        <h2>
          AI Monitoring Status
        </h2>

        <div className="ai-status-grid">

          <div>
            <span>
              Face Detection
            </span>

            <strong>
              {monitoring
                ? "Active"
                : "Inactive"}
            </strong>
          </div>

          <div>
            <span>
              Face Recognition
            </span>

            <strong>
              {monitoring
                ? "Active"
                : "Inactive"}
            </strong>
          </div>

          <div>
            <span>
              Emotion Detection
            </span>

            <strong>
              {monitoring
                ? "Active"
                : "Inactive"}
            </strong>
          </div>

          <div>
            <span>
              Attention Analysis
            </span>

            <strong>
              {monitoring
                ? "Active"
                : "Inactive"}
            </strong>
          </div>

        </div>

      </div>

      {/* ==========================================
          CLASSROOM OVERVIEW
      ========================================== */}
      <div className="ai-monitor-status">

        <h2>
          Classroom Overview
        </h2>

        <div className="ai-status-grid">

          <div>
            <span>
              Students Detected
            </span>

            <strong>
              {students.length}
            </strong>
          </div>

          <div>
            <span>
              Recognized
            </span>

            <strong className="status-good">
              {
                students.filter(
                  (s) =>
                    s.recognized
                ).length
              }
            </strong>
          </div>

          <div>
            <span>
              Distracted
            </span>

            <strong className="status-danger">
              {
                students.filter(
                  (s) =>
                    s.distraction ===
                    "Distracted"
                ).length
              }
            </strong>
          </div>

          <div>
            <span>
              High Attention
            </span>

            <strong className="status-good">
              {
                students.filter(
                  (s) =>
                    s.attentionStatus ===
                    "High"
                ).length
              }
            </strong>
          </div>

        </div>

      </div>

      {/* ==========================================
          IDENTIFIED STUDENTS
      ========================================== */}
      <div className="ai-monitor-status">

        <h2>
          Identified Students
        </h2>

        {students.length === 0 ? (

          <div className="no-students">

            <p>
              No students detected
            </p>

            <span>
              Make sure registered
              students are visible to
              the camera.
            </span>

          </div>

        ) : (

          <div className="student-monitor-grid">

            {students.map(
              (student) => (

                <div
                  className="student-monitor-card"
                  key={student.id}
                >

                  <div className="student-card-header">

                    <div className="student-avatar">
                      👤
                    </div>

                    <div>

                      <h3>
                        {student.name}
                      </h3>

                      <span>
                        {student.recognized
                          ? "✓ Recognized"
                          : "⚠ Face not registered"}
                      </span>

                    </div>

                  </div>

                  <div className="student-detail">

                    <span>
                      Attendance
                    </span>

                    <strong className="status-good">
                      {student.recognized
                        ? "✓ Present"
                        : "— Not Recorded"}
                    </strong>

                  </div>

                  <div className="student-detail">

                    <span>
                      Emotion
                    </span>

                    <strong>
                      {student.emotion}
                    </strong>

                  </div>

                  <div className="student-detail">

                    <span>
                      Emotion Confidence
                    </span>

                    <strong>
                      {student.emotionConfidence}%
                    </strong>

                  </div>

                  <div className="student-detail">

                    <span>
                      Attention
                    </span>

                    <strong>
                      {student.attentionScore}%
                      {" "}
                      (
                      {student.attentionStatus}
                      )
                    </strong>

                  </div>

                  <div className="student-detail">

                    <span>
                      Distraction
                    </span>

                    <strong
                      className={
                        student.distraction ===
                        "Distracted"
                          ? "status-danger"
                          : "status-good"
                      }
                    >
                      {student.distraction}
                    </strong>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Monitoring;